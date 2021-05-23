import React from "react";

export default function Banner({
  isMulti,
  setIsMulti,
  editMode,
  setEditMode,
  showHelp,
  setShowHelp
}) {
  return (
    <>
      <div className="banner">
        <div>
          <img className="rotate" src="/StarVoting.png" alt="STAR Voting" />
          <h1>Star View</h1>
          <div className="mainmenu">
            <div onClick={() => setIsMulti(!isMulti)}>
              {isMulti ? "Multi-Winner" : "Single-Winner"}
            </div>
            <div
              className={editMode ? "selected" : ""}
              onClick={() => {
                setEditMode(!editMode);
                //setShowHelp(false);
              }}
            >
              Edit
            </div>
            <div
              className={showHelp ? "selected" : ""}
              onClick={() => {
                setEditMode(false);
                setShowHelp(!showHelp);
              }}
            >
              Help
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
