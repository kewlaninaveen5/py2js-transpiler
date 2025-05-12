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
        }},
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
        });
        let result = '';

        pyshell.send(pythonCode);

        pyshell.on('message', function (message) {
            result += message + '\n';
        });

        pyshell.on('error', function (pyErr) {
            console.error("PythonShell error:", pyErr);
        });

        pyshell.end(function (err, code, signal) {
            if (err) return res.status(500).json({ error: err });;
            console.log('Exit code:', code);
            console.log('Exit signal:', signal);
            res.json({ jsCode: result });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(
            { error: "Server error occurred. Please try again. Please check the python code once again",
                jsCode: '' 
             });
    }


})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});


