import React, { useState } from "react";
import sample0 from "../sample0";
import sample1 from "../sample1";
import sample2 from "../sample2";

export default function Edit({ csv, title, onSave, onCancel, invalid }) {
  const [caption, setCaption] = useState(title);
  const [data, setData] = useState(csv);
  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };
  const handleDataChange = (event) => {
    setData(event.target.value);
  };
  const onLoad = (index) => {
    switch (index) {
      case 0:
        setCaption("Sample Election");
        setData(sample0);
        break;
      case 1:
        setCaption("2020 Presidential Poll");
        setData(sample1);
        break;
      case 2:
        setCaption("2020 IPO Secretary of State");
        setData(sample2);
        break;
      default:
        break;
    }
  };

  return (
    <div className="editmode">
      <h2>Election Name</h2>
      <input
        value={caption}
        onChange={handleCaptionChange}
        autoFocus={true}
        spellCheck="false"
      />
      <h2>CSV Data</h2>
      {invalid && (
        <div className="invalid">
          <h3>Invalid Data</h3>
          <p>Election data must satisfy the following criteria:</p>
          <ul>
            <li>One column per candidate</li>
            <li>At least two candidates</li>
            <li>One row per voter</li>
            <li>First row is for candidate names</li>
            <li>Subsequent rows with 0-5 scores for each candidate.</li>
          </ul>
        </div>
      )}
      <textarea
        style={{
          height: invalid ? "calc(100vh - 40.75em)" : "calc(100vh - 25em)"
        }}
        spellCheck="false"
        value={data}
        onChange={handleDataChange}
        autoFocus={true}
      />
      <br />
      <button className="primary" onClick={() => onSave(data, caption)}>
        Save
      </button>
      &nbsp;&nbsp;
      <button onClick={onCancel}>Cancel</button>
      <span style={{ marginLeft: "1em" }}>Load Example Data:</span>
      <button onClick={() => onLoad(0)}>Tiny</button>
      <button onClick={() => onLoad(1)}>Presidential Poll</button>
      <button onClick={() => onLoad(2)}>IPO Sec Of State</button>
    </div>
  );
}
