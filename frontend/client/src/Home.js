import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'
import FileUploader from './FileUploader';
import Editor from '@monaco-editor/react';
import Network from './PortfolioNetwork/PortfolioNetwork';


function Home() {
  const [copied, setCopied] = useState(false);
  const [pythonCode, setPythonCode] = useState('#Example \nprint("Hello World") \n#Press Convert to JavaScript to RUN this');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);


  const copyToClipboard = () => {
    if (!jsCode) return;
    navigator.clipboard.writeText(jsCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Copy failed:", err));
  };


  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const BACKEND_URL =
        window.location.hostname === 'localhost'
          ? 'http://localhost:5001'
          : 'https://py2js-transpiler.onrender.com';

      const response = await axios.post(`${BACKEND_URL}/api/convert`, {
        code: pythonCode === '' ? 'print("Hello World")' : pythonCode,
      });
      const { jsCode } = response.data;
      if (jsCode.startsWith('{') && jsCode.includes('"error":')) {
        const errObj = JSON.parse(jsCode);
        throw new Error(errObj.details);
      }
      setJsCode(jsCode || '');

    } catch (err) {
      console.error("Error:", err);
      // alert("This might be an inactivity error due to free server. Please try after 1 minute.")
      setJsCode("//An Error occured while transpiling your code.");
      if (err.response && err.response.data.error.type == "SyntaxError") {
        setError("Transpilation error: " + err.response.data.error.message);
      } else if (err.response) {
        setError("Transpilation error: " + err.response.data.error.message);
      } else {
        setError("Looks like our Server is Down. Please try after 1 minute.")
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="left-panel">
        
        <h1>Python to JavaScript Transpiler</h1>
        <h5>Python code goes here....</h5>
        <Editor
          defaultLanguage="python"
          theme="light"
          options={{
            placeholder: `print("Hello World") \n (Press Convert to RUN this) `,
            minimap: { enabled: false },
            fontSize: 14,
          }}
          value={pythonCode}
          onChange={(value) => setPythonCode(value || '')}
        ></Editor>

        <div className="button-row">
          <FileUploader onFileRead={setPythonCode} />
          <div className="button-col">
            <button onClick={handleConvert} disabled={loading}>
              {loading ? 'Converting...' : 'Convert to JavaScript'}
            </button>
            <a href="/docs" target="_blank" rel="noopener noreferrer">
              <button>Learn How to Use</button>
            </a>
          </div>
        </div>
      </div>

      <div className="right-panel">

        <h3>Converted JavaScript Code</h3>
        {error && <p className="error-message">{error}</p>}
        <Editor
          className={"textarea-editor"}
          height={"calc(min(100% - 20px, 70%))"}
          // ref={codeRef}
          defaultLanguage="javascript"
          theme="light"
          rows="10"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            placeholder: `Your Converted JavaScript Code Appears Here:... \n Eg: Console.log("Hello World")`
          }}
          value={jsCode}
        // onChange={()=>()}
        ></Editor>


        <div className="button-row">
          <div className="button-col">
            <button
              onClick={copyToClipboard}
              disabled={!jsCode}
              className={`mt-2 px-4 py-2 rounded-lg text-white ${jsCode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
            <Network />
        </div>

      </div>

    </div>
  );

}

export default Home;
