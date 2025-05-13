import inspect
import traceback
import ast
import os
import sys
from loop_translators import loopHandlers
from operator_maps import (
COMPARE_OP_MAP,
BOOL_OP_MAP,
UNARY_OP_MAP,
BINARY_OP_MAP,
AUG_ASSIGN_OP_MAP
)

class PyToJsTranspiler(ast.NodeVisitor, loopHandlers):
    def __init__(self):
        self.output = []
        self.indent_level = 0
        self.declared_vars = set()

    def emit(self,line):
        print("line: ", line)
        indent = "    "*self.indent_level
        if line:
            self.output.append(indent + line)
        else:
            self.output.append(indent + "//this line was ommitted due to error in reading the statement")

    def eval_if_constant(self, node):
        try:
            return ast.literal_eval(node)
        except Exception:
            return None

    def visit_Name(self, node):
        return node.id

    def visit_Constant(self, node):
        if node.value is None:
            return "null"
        elif node.value is True:
         return "true"
        elif node.value is False:
            return "false"
        return repr(node.value)
    
    def visit_BoolOp(self,node):
        operation = BOOL_OP_MAP[type(node.op)]
        values = [self.visit(v) for v in node.values]
        return f"({f' {operation} '.join(f'({v})' for v in values)})"
    
    # f"({ f" {operation} ".join(f"({v})" for v in values)})"
    
    def visit_BinOp(self,node):
        # print(ast.dump(node))
        if isinstance(node.left, ast.List) and isinstance(node.op, ast.Mult):
            count = self.visit(node.right)
            val = self.visit(node.left.elts[0])
            return f"Array({count}).fill({val})"

        operation = BINARY_OP_MAP[type(node.op)]
        left = self.visit(node.left)
        right = self.visit(node.right)
        return(f"({left}{operation}{right})")
    
    def visit_UnaryOp(self,node):
        operation = UNARY_OP_MAP[type(node.op)]
        oper = self.visit(node.operand)
        if isinstance(node.op, ast.USub):  # Unary Subtraction (e.g., -3)
            return f"-{oper}"
        elif isinstance(node.op, ast.UAdd):  # Unary Plus (e.g., +3)
            return f"+{oper}"
        return(f"{operation}({oper})")
    
    def visit_Compare(self,node):
        target = self.visit(node.left)
        value = self.visit(node.comparators[0])
        op = node.ops[0]
        operation = COMPARE_OP_MAP[type(op)]
        return(f"{target} {operation} {value}")
    
    def visit_Assign(self, node):
        try:
            target = node.targets[0]
            if isinstance(target, ast.Subscript):
                target_str = self.visit(target)
                value = self.visit(node.value)
                self.emit(f"{target_str} = {value};")
            else:
                target = self.visit(node.targets[0])
                value = self.visit(node.value)
                if target not in self.declared_vars:
                    self.declared_vars.add(target)
                    if isinstance(node.value, ast.Constant):
                        self.emit(f"let {target} = {value};")
                    else:
                        self.emit(f"const {target} = {value};")
                else:
                    self.emit(f"{target} = {value};")
        except Exception as e:
            self.emit(f'/* Error transpiling call {inspect.currentframe().f_code.co_name} Error: {e} */')

    #augAssign
    def visit_AugAssign(self, node):
        target = self.visit(node.target)
        op = AUG_ASSIGN_OP_MAP[type(node.op)]
        value = self.visit(node.value)
        return f"{target} {op} {value}"

    def visit_Expr(self, node):
        # Handle expression statements (like print)
        expr = self.visit(node.value)
        self.emit(expr + ";")

    def visit_Return(self,node):
        stmt = self.visit(node.value)
        self.emit(f"return {stmt};")
    
    def visit_Call(self, node):
        try:
            if isinstance(node.func, ast.Name) and node.func.id == "print":
                args = " + ".join(self.visit(arg) for arg in node.args)
                return f"console.log({args})"
        
        
            elif isinstance(node.func, ast.Name) and node.func.id == "range":
                args = node.args
                def get_val(arg):
                    val = self.eval_if_constant(arg)
                    return int(val) if val is not None else self.visit(arg)
                if len(args) == 1:
                    start = 0
                    end = get_val(args[0])
                    step = 1
                elif len(args) == 2:
                    start = get_val(args[0])
                    end = get_val(args[1])
                    step = 1
                elif len(args) == 3:
                    start = get_val(args[0])
                    end = get_val(args[1])
                    step = get_val(args[2])
                else:
                    return "/* Unsupported range usage */"
                return [start, end, step]
            else:
                funcName = node.func.id
                arguments = [self.visit(arg) for arg in node.args]
                arguments_str = ", ".join(arg for arg in arguments)
                return f"{funcName}({arguments_str})"
        except Exception as e:
            return f'/* Error transpiling call {node.func.id} function: {e} */'
    
    # Conditional statements is below
    def visit_If(self,node, is_elif = False):
        condition = self.visit(node.test)
        if is_elif:
            self.emit(f"else if ({condition}" + ") {")
        else:
            self.emit(f"if ({condition}) " + "{")
        self.indent_level += 1
        for statement in node.body:
            self.visit(statement)
        self.indent_level -= 1
        self.emit("}")
        if (node.orelse):
            if isinstance(node.orelse[0], ast.If):
                self.visit_If(node.orelse[0], is_elif=True)
            else:
                self.emit("else {")
                self.indent_level += 1
                for statement in node.orelse:
                    self.visit(statement)
                self.indent_level -= 1
                self.emit("}")

    def visit_IfExp(self, node):
        condition = self.visit(node.test)
        body = self.visit(node.body)
        orelse = self.visit(node.orelse)
        return f"({condition} ? {body} : {orelse})"

    # Definining custom Functions: 

    def visit_FunctionDef(self, node):
        try: 
            functionName = node.name
            arguments = [arg.arg for arg in node.args.args]
            if node.args.defaults:
                defaults = [self.visit(default) for default in node.args.defaults]
                N = len(arguments)-1
                while defaults:
                    arguments[N] = " = ".join([arguments[N], defaults.pop(len(defaults)-1)])
                    N -= 1
            arguments_strings = ', '.join(arg for arg in arguments)

            self.emit(f"const {functionName} = ({arguments_strings}) => " + "{")
            self.indent_level += 1
            for stmt in node.body:
                self.visit(stmt)
            self.indent_level -= 1
            self.emit("}")
        except Exception as e:
            self.emit(f'/* Error transpiling call {inspect.currentframe().f_code.co_name} Error: {e} */')
        

        #  List Comprehension: 

    def visit_List(self,node):
        try: 
            array = [self.visit(el) for el in node.elts]
            return f"[{', '.join(array)}]"
        except Exception as e:
            return(f'/* Error transpiling call {inspect.currentframe().f_code.co_name} Error: {e} */')
    
    def visit_comprehension(self, node):
        target = self.visit(node.target)
        if isinstance(node.iter, ast.Name):
            iterable = self.visit(node.iter)
        else:
            iterable = self.visit(node.iter)
            # length = iterable[1]
        # return {"target": target, "iterable" : iterable}
        return [ target, iterable]
    
    # def visit_ListComp(self, node):
    #     stmt = self.visit(node.elt)
    #     target, length = self.visit(node.generators[0])
    #     print("length: ", length)
    #     return f"Array.from(" + "{" + f"length: {length}" + "}" + f", (_, {target}) => {stmt})"
    
    def visit_ListComp(self, node):
        # print(ast.dump(node))
        # Handle the expression inside the list comprehension
        expression = self.visit(node.elt)
        # Handle the iterable
        iter = self.visit(node.generators[0])
        # print(iter)
        # print("lis:", iter)
        # print(expression)
        # Return the equivalent JavaScript code using map
        return f"{iter[1]}.map(({iter[0]}) => {expression})"

    # Dict Literals

    def visit_Dict(self,node):
        keys, vals =[], []
        for key in node.keys:
            keys.append(self.visit(key))
        for val in node.values:
            vals.append(self.visit(val))
        ret_str =[]
        for i in range(len(keys)):
            ret_str.append(f"{keys[i]} : {vals[i]}")
        return "{" + ", ".join(ret_str) + "}"
    
    # Set Literals
    
    def visit_Set(self,node):
        keys = []
        for key in node.elts:
            keys.append(self.visit(key))
        return "new Set([" + ", ".join(keys) + "])"
    
    # Subscript

    def visit_Subscript(self, node):
        value = self.visit(node.value)
        slice = self.visit(node.slice)
        if isinstance(node.slice, ast.Constant):
            return f"{value}[{slice}]"
        elif isinstance(node.slice, ast.Slice):
            return f"{value}.slice({slice})"
        return "/* Unsupported Subscript type usage. Only Slice and Constant are the Supported Types.  */"
    
    def visit_Slice(self, node):
        lower = self.visit(node.lower)
        upper = self.visit(node.upper)
        return f"{lower},{upper}"
    
    # Import Statements: 
    # def visit_alias(self, node):
    #     return node.name
    
    def visit_Import(self, node):
        for alias in node.names:
            module = alias.name
            asname = alias.asname or module
            self.emit(f"import * as {asname} from '{module}';")
        return None
    
    def visit_ImportFrom(self, node):
        module = node.module
        packages = []
        for alias in node.names:
            packages.append(alias.name)
        self.emit("import {" + f"{ ', '.join(packages) }" + "} from" + f" '{module}';")

    # ?try catch blockssss
    def visit_Try(self, node):
        # print("try node: ", ast.dump(node.handlers[0]))
        self.emit("try {")
        self.indent_level += 1
        for stmt in node.body:
            self.visit(stmt)
        self.indent_level -= 1
        self.emit("}")

        for handler in node.handlers:
            exception_name = "e"  # default name
            if handler.type:
                exception_name = handler.name
                # exception_name = self.visit(handler.type)
            self.emit(f"catch ({exception_name}) " + "{")
            self.indent_level += 1
            for stmt in handler.body:
                # print("stmt: ", ast.dump(stmt))
                self.visit(stmt)
            self.indent_level -= 1
            self.emit("}")
        
        if node.finalbody:
            self.emit("finally {")
            self.indent_level += 1
            for stmt in node.finalbody:
                self.visit(stmt)
            self.indent_level -= 1
            self.emit("}")

    def transpile(self, code):
        tree = ast.parse(code)
        # print("tree:  ", ast.dump(tree, indent=4))
        self.visit(tree)
        return "\n".join(self.output)

# Example usage
if __name__ == "__main__":
    transpiler = PyToJsTranspiler()
    try:
        python_code = sys.stdin.read()
        js_code = transpiler.transpile(python_code)
        print(js_code)
    except Exception as e:
        sys.stderr.write(traceback.format_exc())  # ✅ Important
        sys.exit(1)

    # fileName = "test"
    # test_path = os.path.join(os.path.dirname(__file__),"..","..", "tests", f"{fileName}.py")
    # with open(test_path, "r") as f:
    #     python_code = f.read()
    # js_code = transpiler.transpile(python_code)
    # print(js_code)
    # output_dir = os.path.join(os.path.dirname(__file__), "..","..", "output")
    # os.makedirs(output_dir, exist_ok=True)  # Create the folder if it doesn't exist
    # output_path = os.path.join(output_dir, f"{fileName}Output.js")
    # with open(output_path, "w") as f:
    #     f.write(js_code)
    #     print("✅ Transpilation complete. Output saved to output.js")