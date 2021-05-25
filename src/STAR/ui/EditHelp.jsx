import React from "react";

export default function EditHelp({ setShowHelp }) {
  return (
    <div className="help">
      <div className="close" onClick={() => setShowHelp(false)}>
        X
      </div>
      <h1>Help</h1>
      <div>
        <p>
          Just paste your election results below. You can paste from Excel,
          Google Sheets, or most any CSV text file. Your data should be a
          multi-line string with the first line specifying candidate names and
          subsequent lines representing ballots. Most column delimiters are
          supported including commas, tabs, and semi-colons.
        </p>
        <p>
          <b>TIP</b>: Click the <i>Sample Data</i> buttons for examples of how
          election data can be formatted
        </p>
      </div>
    </div>
  );
}
