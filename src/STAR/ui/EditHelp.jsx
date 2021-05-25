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
          You can even include blank lines and comment lines (starting with //)
          which will be ignored but allow you to annotate your data.
        </p>
      </div>
    </div>
  );
}
