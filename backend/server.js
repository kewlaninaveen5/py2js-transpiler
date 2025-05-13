const express = require('express')
const cors = require('cors');
// const path = require('path');
const bodyParser = require('body-parser')
const { PythonShell } = require("python-shell")    // Allows us to run Python code from Node.js



const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://py2jstranspiler.netlify.app',
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST'],
    credentials: true
}));
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json())

const pythonFilePath = __dirname + "/core/py2js_transpiler.py";


app.post("/api/convert", (req, res) => {
    const pythonCode = req.body.code
    console.log(pythonCode)
    try {
        const pyshell = new PythonShell(pythonFilePath, {
            mode: 'text',
            pythonPath: 'python3',
            // stdio: ['pipe', 'pipe', 'pipe'],
            pythonOptions: ['-u'],
        });
        let result = '';
        let errorOutput = '';




        pyshell.on('message', function (message) {
            result += message + '\n';
        });

        pyshell.on('stderr', function (stderr) {
            console.error("stderr from PythonShell:", stderr);
            errorOutput += stderr + '\n';
        });
        pyshell.on('error', function (err) {
            console.error("PythonShell internal error:", err);
            errorOutput += err.message + '\n';
        });

        pyshell.send(pythonCode);


        pyshell.end(function (err, code, signal) {
            if (err) {
                console.error('PythonShell error:', err);
                console.error('Stderr output:', errorOutput);
                const match = err.traceback?.match(/File "<unknown>", line (\d+)\n\s+(.*)\n\s+\^.*\nSyntaxError: (.*)/);

                if (match) {
                    const line = parseInt(match[1], 10);
                    const codeLine = match[2];
                    const message = match[3];

                    return res.status(400).json({
                        error: {
                            type: "SyntaxError",
                            message,
                            line,
                            codeLine
                        }
                    });
                }

                return res.status(500).json({
                    error: {
                        type: "InternalError",
                        message: err.message || "An unknown error occurred in the Python transpiler."
                    }
                });
                // return res.status(500).json({ error: errorOutput || 'An Error occured during code conversion' });;

            }
            console.log('Exit code:', code);
            console.log('Exit code:', errorOutput);
            console.log('Exit signal:', signal);
            res.json({ jsCode: result });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(
            {
                error: "Server error occurred. Please try again. Please check the python code once again",
                jsCode: ''
            });
    }


})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});


