import ast

# Operator Mappings

COMPARE_OP_MAP = {
    ast.Eq: "===",
    ast.NotEq: "!==",
    ast.Lt: "<",
    ast.LtE: "<=",
    ast.Gt: ">",
    ast.GtE: ">=",
    ast.Is: "===",
    ast.IsNot: "!==",
    ast.In: "in",
    ast.NotIn: "not in",  # Will need special handling later
}

BOOL_OP_MAP = {
    ast.And: "&&",
    ast.Or: "||",
}

UNARY_OP_MAP = {
    ast.UAdd: "+",
    ast.USub: "-",
    ast.Not: "!",
    ast.Invert: "~",
}

BINARY_OP_MAP = {
    ast.Add: "+",
    ast.Or: "||",
}




class PyToJsTranspiler(ast.NodeVisitor):
    def __init__(self):
        self.output = []
        self.indent_level = 0
        self.declared_vars = set()

    def emit(self,line):
        indent = "  "*self.indent_level
        self.output.append(indent + line)

    def eval_if_constant(self, node):
        try:
            return ast.literal_eval(node)
        except Exception:
            return None

    def visit_Name(self, node):
        return node.id

    def visit_Constant(self, node):
        return repr(node.value)
    
    def visit_BoolOp(self,node):
        operation = BOOL_OP_MAP[type(node.op)]
        vals = []
        for value in node.values:
            vals.append(self.visit(value))
        return(f"({vals[0]}) {operation} ({vals[1]})")
    
    def visit_BinOp(self,node):
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
        # print("Compare: " , ast.dump(node))
        target = self.visit(node.left)
        value = self.visit(node.comparators[0])
        op = node.ops[0]
        operation = COMPARE_OP_MAP[type(op)]
        return(f"{target} {operation} {value}")
    
    def visit_Assign(self, node):
        # print("Assign:  ","node.targets: ", ast.dump(node.targets[0], indent=4))
        # Assume single assignment target
        target = self.visit(node.targets[0])
        value = self.visit(node.value)
        if target not in self.declared_vars:
            self.declared_vars.add(target)
            self.emit(f"let {target} = {value};")
        else:
            self.emit(f"{target} = {value};")

    def visit_Expr(self, node):
        # Handle expression statements (like print)
        # print("expr:  ", "node.value: ", ast.dump(node.value, indent=4))
        expr = self.visit(node.value)
        self.emit(expr + ";")
    
    def visit_Call(self, node):
        # Basic print() handling
        if isinstance(node.func, ast.Name) and node.func.id == "print":
            args = ", ".join(self.visit(arg) for arg in node.args)
            return f"console.log({args})"
        if isinstance(node.func, ast.Name) and node.func.id == "range":
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


        return "/* Unsupported function call */"
    
    # Conditional statements is below

    def visit_If(self,node, is_elif = False):
        # print("inside if: ", ast.dump(node, indent=2))
        condition = self.visit(node.test)
        if is_elif:
            self.emit(f"else if {condition} " + "{")
        else:
            self.emit(f"if {condition} " + "{")
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

    # We are starting with loops here: 

    def visit_While(self,node):
        condition = self.visit(node.test)
        self.emit(f"while {condition}" + " {")
        self.indent_level += 1
        for statement in node.body:
            self.visit(statement)
        self.indent_level -= 1
        self.emit("}")

        # we have some trouble in the for loop : cant have negetive iterators

    def visit_For(self,node):
        itr = node.target.id
        decl = ""
        if itr not in self.declared_vars:
            self.declared_vars.add(itr)
            decl = "let "
        values = self.visit(node.iter)
        print(values)
        start, end, step = values

        step_val = self.eval_if_constant(step)
        if step_val is not None:
            print("holaaaaaaaa")
            comparator = "<" if step_val > 0 else ">"
            increment = "+" if step_val > 0 else "-"
        else:
            print(step, type(step))
            comparator = "<"  # Default to less-than if step is variable
            increment = "+"  # we have some issue here. we cant extract negetive iterator value.
        self.emit(f"For ({decl}{itr}= {start}, {itr}{comparator}{end}, {itr}={itr}{increment}{step})" + " {")
        self.indent_level += 1
        for statement in node.body:
            self.visit(statement)
        self.indent_level -= 1
        self.emit("}")
        # Remove iterator after loop if it's temporary
        self.declared_vars.discard(itr)

    def transpile(self, code):
        tree = ast.parse(code)
        print("tree:  ", ast.dump(tree, indent=4))
        self.visit(tree)
        return "\n".join(self.output)

# Example usage
if __name__ == "__main__":
    python_code = '''
x = 5
for i in range(1, x, 2):
    print(i)

'''
    transpiler = PyToJsTranspiler()
    js_code = transpiler.transpile(python_code)
    print(js_code)
