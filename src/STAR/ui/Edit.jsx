import React, { useState } from "react";
import sampleDefault from "../samples/default";
import sampleMultipliers from "../samples/multipliers";
import samplePrezPoll from "../samples/prezpoll";
import sampleIPO from "../samples/ipo";

export default function Edit({ csv, title, onSave, onCancel, invalid }) {
  const [caption, setCaption] = useState(title);
  const [data, setData] = useState(csv);
  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };
  const handleDataChange = (event) => {
    setData(event.target.value);
  };
  const onLoad = (name) => {
    switch (name) {
      case "default":
        setCaption("Sample Election");
        setData(sampleDefault);
        break;
      case "multipliers":
        setCaption("Sample With Ballot Multipliers");
        setData(sampleMultipliers);
        break;
      case "prezpoll":
        setCaption("2020 Presidential Poll");
        setData(samplePrezPoll);
        break;
      case "ipo":
        setCaption("2020 IPO Secretary of State");
        setData(sampleIPO);
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
        spellCheck="false"
        data-gramm_editor="false"
        value={data}
        onChange={handleDataChange}
        autoFocus={true}
      />
      <div className="buttons">
        <button className="primary" onClick={() => onSave(data, caption)}>
          Save
        </button>
        &nbsp;&nbsp;
        <button onClick={onCancel}>Cancel</button>
        <span className="label">Sample Data:</span>
        <button onClick={() => onLoad("default")}>Default</button>
        <button onClick={() => onLoad("multipliers")}>w/Multipliers</button>
        <button onClick={() => onLoad("prezpoll")}>Presidential Poll</button>
        <button onClick={() => onLoad("ipo")}>IPO 2020</button>
      </div>
    </div>
  );
}
