import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/api/convert', { code: pythonCode });
      setJsCode(response.data.jsCode);
    } catch (error) {
      setError('Error converting Python to JavaScript');
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
 