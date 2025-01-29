import { useState } from "react";

export default function AddNumber(props) {
  let [state, setState] = useState({size: 0});
  return (
    <div>
      <h1>Add Number</h1>
      <input type="button" value="+" onClick={() => {
        props.onClick(state.size);
      }}></input>
      <input type="text" value={state.size} onChange={(e) => {
        setState({size: Number(e.target.value)});
      }}></input>
    </div>
  )
}