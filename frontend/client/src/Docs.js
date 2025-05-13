
import React from 'react';
import './Docs.css';
import { Editor } from '@monaco-editor/react';

const Docs = () => {
    return (
        <div className="docs-container">
            <header className="docs-header">
                <h1>📘 Py2JS Transpiler Documentation</h1>
                <p>The Concept is simple:  </p>
            </header>

            <section className="docs-section">
                <h2> Usability:</h2>
                <p> If you need a Javascript file but you only know Python?
                    Or you have a python file that needs to be written in Javascript? <br />
                    No worries, we will convert your Python code into real usable JavaScript Code </p>
            </section>

            <section className="docs-section">
                <h2> Directions to Use?</h2>
                <p>Paste your Python code into the editor, click "Convert", and get equivalent JavaScript code.
                    Its as simple as that! </p>
            </section>

            <hr />
            <section className="docs-section">
                <h2>✅ Supported Features</h2>
                <p>
                    <b>This is an MPV (Minimum Viable Product) and thus it supports limited python conversion.</b><br />
                    The Features currently mentioned here are  supported and can be converted successfully:
                </p>

                
            </section>

            <section className="docs-section">
                <div className="docs-section">
                    <div className="docs-section">
                        <h2>1. Assignment</h2>
                        <div className="example-title">Test Case: Assignment</div>
                        <pre className="example-code">{`# Python
a = 10

# JavaScript
let a = 10;`}</pre>
                    </div>


                </div>

                <div className="docs-section">
                    <h2>2. Print Statements</h2>
                    <div className="example-title">Test Case: Print Statement</div>
                    <pre className="example-code">
                        {`# Python
print("Hello")

# JavaScript
console.log("Hello");`}
                    </pre>
                </div>

                <div className="docs-section">
                    <h2>3. If / Else Conditions</h2>
                    <div className="example-title">Test Case: If / Else</div>
                    <pre className="example-code">{`# Python
x = 5
if x > 0:
    print("Positive")
else:
    print("Non-positive")

# JavaScript
let x = 5;
if (x > 0) {
console.log("Positive");
} else {
console.log("Non-positive");
}`}</pre>
                </div>

                <div className="docs-section">
                    <h2>4. Loops (for with range, while)</h2>
                    <div className="example-title">Test Case: For Loop with Range</div>
                    <pre className="example-code">{`# Python
for i in range(1, 5):
    print(i)

# JavaScript
for (let i = 1; i < 5; i += 1) {
console.log(i);
}`}</pre>

                    <div className="example-title">Test Case: While Loop</div>
                    <pre className="example-code">{`# Python
x = 0
while x < 3:
    print(x)
    x += 1

# JavaScript
let x = 0;
while (x < 3) {
console.log(x);
x += 1;
}`}</pre>
                </div>

                <div className="docs-section">
                    <h2>5. Function Definitions and Calls</h2>
                    <div className="example-title">Test Case: Function</div>
                    <pre className="example-code">{`# Python
def add(a, b):
    return a + b

print(add(3, 4))

# JavaScript
function add(a, b) {
return a + b;
}
console.log(add(3, 4));`}
                    </pre>
                </div>

                <div className="docs-section">
                    <h2>6. Boolean & Arithmetic Operators</h2>
                    <div className="example-title">Test Case: Operators</div>
<pre className="example-code">{`# Python
print(3 + 2 * 5 > 10 and not False)

# JavaScript
console.log(3 + 2 * 5 > 10 && !false);`}</pre>
</div>


                <div className="docs-section">
                    <h2>7. Syntax Error Handling</h2>
                    <div className="example-title">Test Case: Syntax Error</div>
                    <pre className="example-code">{`# Python
print("Hello World)

# Transpiler Output
SyntaxError: unterminated string literal (detected at line 1)`}</pre>
                </div>

                <div className="docs-footer">
                    &copy; {new Date().getFullYear()} Py2JS Transpiler. All rights reserved.
                </div>
            </section>


            <section className="docs-section">
                <h2>🧪 Example Input</h2>
                <p>You can try the following Python code in the editor:</p>
                <pre className="example-code">
                    {`def add(n1, n2):
    return n1 + n2

def sub(n1, n2):
    return n1 - n2

def mul(n1, n2):
    return n1 * n2

def div(n1, n2):
    return n1 / n2

print("Please select operation -"\n
"1. Add"\n
"2. Subtract"\n
"3. Multiply"\n
"4. Divide"\n)


if sel == 1:
    print(n1, "+", n2, "=", add(n1, n2))
elif sel == 2:
    print(n1, "-", n2, "=", sub(n1, n2))
elif sel == 3:
    print(n1, "*", n2, "=", mul(n1, n2))
elif sel == 4:
    print(n1, "/", n2, "=", div(n1, n2))
else:
    print("Invalid input")`}
                </pre>
            </section>

            <section className="docs-section">
                <h2>🛠️ Notes</h2>
                <p>While most of any normal code will get converted, there are some areas where we are still working.</p>
                <ul>
                    <li>Multi-variable assignment, complex destructuring are not yet supported.</li>
                    <li>Nested functions and classes are under development.</li>
                    <li>Range with dynamic or negative values works with fallback
                        logic (you might want to check the output code in that case).</li>
                </ul>
            </section>
            <section className="docs-section">
                <h2>🧰 Tech Stack</h2>
                <ul>
                    <li>
                        <strong>Frontend</strong>: <code>React.js</code> with <code>Monaco Editor</code> for an interactive coding experience.
                    </li>
                    <li>
                        <strong>Styling</strong>: <code>Tailwind CSS</code> for layout and utility classes, and custom CSS modules for documentation.
                    </li>
                    <li>
                        <strong>Routing</strong>: <code>React Router DOM</code> for navigation between Home and Docs pages.
                    </li>
                    <li>
                        <strong>Backend</strong>: <code>Node.js, ExpressJS</code>  (with Python integrated via python-shell for transpiling).
                    </li>
                    <li>
                        <strong>Parsing</strong>: <code>Python AST (Abstract Syntax Tree)</code> to analyze and convert Python code structure.
                    </li>
                    <li>
                        <strong>Deployment</strong>: Hosted using <code>Render</code> or similar cloud platforms for live use.
                    </li>
                </ul>
            </section>


            <footer className="docs-footer">
                <p>Made with ❤️ for developers</p>
            </footer>
        </div>
    );
};

export default Docs;
