const express = require('express')
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const { PythonShell } = require("python-shell")    // Allows us to run Python code from Node.js



const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // change if your frontend runs elsewhere
    methods: ['GET', 'POST'],               // or ['GET', 'POST'] if needed
    credentials: true
}));
const PORT = 5001;

app.use(bodyParser.json())

const pythonFilePath = '/Users/naveenkewlani/Desktop/webProjects/py2js-transpiler/core/py2js_transpiler.py';

app.post("/api/convert", (req, res) => {
    const pythonCode = req.body.code
    // console.log("[server.js Line 22] req.body.code: ", pythonCode)
    let options = {
        mode: 'text',
        pythonPath: 'python3',
        scriptPath: path.dirname(pythonFilePath),
        // args: [pythonCode],
        stderrParser: (line) => console.error("PYTHON STDERR:", line),
        timeout: 10 // in seconds
    };

    const pyshell = new PythonShell('py2js_transpiler.py', options);

    let result = '';
    pyshell.on('message', (message) => {
        result += message + '\n';
    });
    pyshell.on('stderr', (stderr) => {
        console.error('PYTHON STDERR:', stderr);
    });

    pyshell.on('close', () => {
        console.log('Transpiled result:', result);
        res.json({ jsCode: result });
    });

    pyshell.on('error', (err) => {
        console.error('PythonShell Error:', err);
        res.status(500).send({ error: 'Error transpiling code' });
    });

    pyshell.send(pythonCode).end();

    // console.log("outside shell")
    //     PythonShell.run('py2js_transpiler.py',options, (err, result) => {
    //         console.log("inside shell")
    //         if(err) {
    //             console.error("PythonShell Error:", err);
    //             res.status(500).send({error: "Error transpiling code"});

    //         } else {
    //             console.log("Transpiled result:", result);
    //             res.json({jsCode: result.join('\n')}); // Return the transpiled JavaScript code

    //         }
    //         console.log("outside python shelllllllllllllllllllllll")
    //     })

    console.log("outside python")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});


