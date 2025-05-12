const express = require('express')
const cors = require('cors');
// const path = require('path');
const bodyParser = require('body-parser')
const { PythonShell } = require("python-shell")    // Allows us to run Python code from Node.js



const app = express();
app.use(cors({
    origin: 'https://py2jstranspiler.netlify.app', // change if your frontend runs elsewhere
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST'],               // or ['GET', 'POST'] if needed  
    credentials: true
}));
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json())

const pythonFilePath = __dirname + "/core/py2js_transpiler.py";
const pyshell = new PythonShell(pythonFilePath,{
    mode: 'text',
    pythonPath: 'python3',
    // scriptPath: pythonFilePath
});
let result = ''; // accumulate all lines

app.post("/api/convert", (req, res) => {  
    const pythonCode = req.body.code          //python file working -Naveen
    console.log(pythonCode)
    pyshell.send(pythonCode);

    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        result += message + '\n';
        console.log("message: ", message);
        // res.json({ jsCode: message });
    });
    
    // end the input stream and allow the process to exit 
    pyshell.end(function (err, code, signal) {
        if (err) throw err;
        console.log(result)
        res.json({ jsCode: result });
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
    });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
});


