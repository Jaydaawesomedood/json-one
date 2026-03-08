import { useState } from 'react'
import './App.css'
import RawTextEditor from './components/RawTextEditor';
import JsonTreeViewer from './components/JsonTreeViewer';
import type { JsonValue } from './types/JsonValue';

function App() {
  const [raw, setRaw] = useState("");
  const [json, setJson] = useState<JsonValue>("");
  const [error, setError] = useState("");

  const handleParse = (input: string) => {
    try {
      setJson(JSON.parse(input));
      setError("");
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <div className='mainContainer'>
      <div className="rawTextEditor">
        <RawTextEditor text={raw} onRawTextChange={(input: string) => { setRaw(input); handleParse(input); }}  />
      </div>
      <div className="resultViewer">
        <JsonTreeViewer data={json} error={error} />
      </div>
    </div>
  )
}

export default App;
