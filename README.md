# py2js-transpiler
Transpiler to convert Python code to JavaScript. Parses Python source into an AST and generates equivalent JavaScript code, enabling seamless cross-language translation for educational and development purposes.

## Installation
- Clone the repository
- Install Python 3.x
- Run `python py2js_transpiler.py <input_file>.py`

## Features
- Basic Python to JS translation (print, variable assignments, if/else, for loops, etc.)
- Support for Python ranges, conditions, and other basic constructs

## Limitations
- Negative step values in `range()` are not fully supported

## Unit Tests
You can see the example code for testing in the unittest.py file.
To run the unit tests, make sure you have Python installed and then execute the following command:

```bash
python -m unittest discover


