import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';

function App() {
  const [pythonCode, setPythonCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePythonCodeChange = (e) => {
    setPythonCode(e.target.value);
  };

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
      <h1>Python to JavaScript Transpiler</h1>

      <textarea
        rows="10"
        cols="50"
        placeholder="Enter Python code here..."
        value={pythonCode}
        onChange={handlePythonCodeChange}
      ></textarea>

      <div>
        <FileUploader onFileRead={setPythonCode} />
        <button onClick={handleConvert} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to JavaScript'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {jsCode && (
        <div>
          <h3>Converted JavaScript Code:</h3>
          <pre>{jsCode}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
