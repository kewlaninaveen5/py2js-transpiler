
class loopHandlers:

    def visit_While(self,node):
        condition = self.visit(node.test)
        self.emit(f"while ({condition}" + ") {")
        self.indent_level += 1
        for statement in node.body:
            self.emit(self.visit(statement))
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
        # print(values)
        start, end, step = values

        step_val = self.eval_if_constant(step)
        if step_val is not None:
            comparator = "<" if step_val > 0 else ">"
            increment = "+" if step_val > 0 else "-"
        else:
            comparator = "<"  # Default to less-than if step is variable
            increment = "+"  # we have some issue here. we cant extract negetive iterator value.
        self.emit(f"for ({decl}{itr}= {start}; {itr}{comparator}{end}; {itr}={itr}{increment}{step})" + " {")
        self.indent_level += 1
        for statement in node.body:
            self.emit(self.visit(statement))
        self.indent_level -= 1
        self.emit("}")
        # Remove iterator after loop if it's temporary
        self.declared_vars.discard(itr)

