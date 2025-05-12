import os
import sys


if __name__ == "__main__":
    message = sys.stdin.read()
    print(type(message), message)
    x = len(message)
    print(x)


    # transpiler = PyToJsTranspiler()
    # print("running")
    # js_code = transpiler.transpile(python_code)
    # print(js_code)