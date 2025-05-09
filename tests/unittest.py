import unittest
from py2js_transpiler import PyToJsTranspiler  # Import your transpiler class

class TestPy2JsTranspiler(unittest.TestCase):
    
    def setUp(self):
        self.transpiler = PyToJsTranspiler()

    def test_simple_assignment(self):
        python_code = "x = 5"
        expected_output = "let x = 5;"
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_print_statement(self):
        python_code = 'print("Hello, World!")'
        expected_output = 'console.log("Hello, World!");'
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_if_statement(self):
        python_code = '''
if x == 5:
    print("x is 5")
'''
        expected_output = '''
if (x === 5) {
  console.log("x is 5");
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_while_loop(self):
        python_code = '''
while x < 10:
    x = x + 1
    print(x)
'''
        expected_output = '''
while (x < 10) {
  x = x + 1;
  console.log(x);
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_for_loop(self):
        python_code = '''
for i in range(3):
    print(i)
'''
        expected_output = '''
for (let i = 0; i < 3; i = i + 1) {
  console.log(i);
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_range_function(self):
        python_code = '''
for i in range(3, -3, -1):
    print(i)
'''
        expected_output = '''
for (let i = 3; i > -3; i = i - 1) {
  console.log(i);
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_multiple_conditions(self):
        python_code = '''
if x > 5 and y < 3:
    print("Condition met")
'''
        expected_output = '''
if (x > 5 && y < 3) {
  console.log("Condition met");
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_elif_condition(self):
        python_code = '''
if x == 5:
    print("x is 5")
elif x < 5:
    print("x is less than 5")
else:
    print("x is greater than 5")
'''
        expected_output = '''
if (x === 5) {
  console.log("x is 5");
} else if (x < 5) {
  console.log("x is less than 5");
} else {
  console.log("x is greater than 5");
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_variable_reuse(self):
        python_code = '''
x = 5
x = x + 1
print(x)
'''
        expected_output = '''
let x = 5;
x = x + 1;
console.log(x);'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

    def test_negative_range(self):
        python_code = '''
for i in range(10, 0, -2):
    print(i)
'''
        expected_output = '''
for (let i = 10; i > 0; i = i - 2) {
  console.log(i);
}'''
        result = self.transpiler.transpile(python_code)
        self.assertEqual(result, expected_output)

if __name__ == "__main__":
    unittest.main()
