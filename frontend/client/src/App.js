import React, { useState } from 'react';
import axios from 'axios';
import './App.css'
import FileUploader from './FileUploader';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

function App() {
  const [pythonCode, setPythonCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5001/api/convert", {
        code: pythonCode,
      });

      setJsCode(response.data.jsCode || '');
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to transpile code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="left-panel">
        <h1>Python to JavaScript Transpiler</h1>
        <Editor
          defaultLanguage="python"
          theme= "light"
          options = {{
            placeholder: `Enter Python code here... \n Eg: print("Hello World")`,
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
            <button disabled={true}>
              Visit Docs
            </button>
          </div>
        </div>
      </div>

      <div className="right-panel">
        
        <h3>Converted JavaScript Code</h3>
        {error && <p className="error-message">{error}</p>}
        <Editor
        className={"textarea-editor"}
        height={"calc(min(100% - 20px, 70%))"}
          defaultLanguage="javascript"
          theme ="light"
          rows="10"
          options = {{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            placeholder: `Your Converted JavaScript Code Appears Here:... \n Eg: Console.log("Hello World")`}}
          value={jsCode}
          // onChange={()=>()}
        ></Editor>
        <div className="button-row">
          <div className="button-col">
            <button disabled={true}>
              Copy to Clipboard
            </button>
          </div>
        </div>
        
      </div>

    </div>
  );

}

export default App;
