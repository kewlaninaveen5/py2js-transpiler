import math
from math import sqrt, pi

def greet(name="World"):
    print("Hello,", name)

def add(x, y=10):
    return x + y

nums = [1, 2, 3, 4, 5]
squares = [n*n for n in nums]
doubled = [None] * 3

user = {"name": "Alice", "age": 25}
unique_items = {1, 2, 2, 3}

total = 0
for i in range(5):
    total += i

i = 0
while i < 5:
    total += i
    i += 1

x = 10
y = 5
max_val = x if x > y else y

if x > y:
    print("x is greater")
else:
    print("y is greater or equal")

def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError as e:
        print("Error:", e)
    finally:
        print("Cleanup complete")

result = add(5)
greet("Naveen")
safe_divide(10, 0)
print("Sliced:", nums[1:4])