import './App.css';
import AddNumberRoot from './components/AddNumberRoot';
import DisplayNumberRoot from './components/DisplayNumberRoot';
import { useState } from "react";

function App() {
  let [state, setState] = useState({number: 0});
  return (
    <div className="App">
      <h1>Root</h1>
      <AddNumberRoot></AddNumberRoot>
      <DisplayNumberRoot></DisplayNumberRoot>
    </div>
  );
}

export default App;
