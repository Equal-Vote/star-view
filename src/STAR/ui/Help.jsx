import React from "react";

export default function Help({
  isMulti,
  setIsMulti,
  setShowHelp,
  setEditMode
}) {
  return (
    <div>
      <div className="help">
        <div>
          <div className="close" onClick={() => setShowHelp(false)}>
            X
          </div>
          <h1>Help</h1>
          <p>
            <b>STAR</b> = <b>Score</b> <b>T</b>hen <b>A</b>utomatic{" "}
            <b>Runoff</b>
          </p>
          <ul>
            <li>
              <b>Score</b>: Voters score candidates from zero (worst) to five
              (best).
            </li>
            <li>
              <b>Runoff</b>: The top two highest scoring candidates are
              finalists. The most preferred candidate wins.
            </li>
          </ul>
          <p className="larger">
            <b>TIP</b>: Click{" "}
            <b
              className="link"
              onClick={() => {
                setEditMode(true);
                setShowHelp(false);
              }}
            >
              EDIT
            </b>{" "}
            to paste in your own election results!
          </p>

          <h3>Need More Help?</h3>
          <ul>
            <li>
              Learn more about STAR Voting at{" "}
              <a
                href="https://www.starvoting.us/"
                target="_blank"
                rel="noreferrer"
              >
                www.starvoting.us
              </a>
            </li>
            <li>
              <a href="mailto:jay@equal.vote?subject=STAR View">Email me</a>{" "}
              with questions or feedback!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
