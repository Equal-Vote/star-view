import React from "react";

export default function StarClassic({ cvr, isMulti, onHover, selected }) {
  return (
    <div>
      <div className="classic wrapper">
        <div>
          <h1>Scoring Round:</h1>
          <h2>
            The two highest scoring
            <br />
            candidates advance
          </h2>
        </div>
        <div></div>
        <h1>Automatic Runoff:</h1>
        <h2>
          The finalist preferred by
          <br />
          more voters wins
        </h2>
      </div>
    </div>
  );
}
