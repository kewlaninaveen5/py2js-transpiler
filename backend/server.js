const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const {PythonShell} = require("python-shell")    // Allows us to run Python code from Node.js

const app = express();
const PORT = 5001;

app.use(bodyParser.json())

const pythonFilePath = '/Users/naveenkewlani/Desktop/webProjects/py2js-transpiler/core/py2js_transpiler.py';


app.post("/api/convert", (req, res) => {
    const pythonCode = req.body.code

    let options = {
        mode: 'text',
        pythonPath: 'python3', // or 'python3' depending on your system
        scriptPath: path.dirname(pythonFilePath), // specify the path to the folder containing the script
        args: [pythonCode], // pass the Python code as an argument
    };

PythonShell.run('py2js_transpiler.py',options, (err, result) => {
    if(err) {
        res.status(500).send({error: "Error transpiling code"});

    } else {
        res.json({jsCode: result.join('\n')}); // Return the transpiled JavaScript code

    }
})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});


