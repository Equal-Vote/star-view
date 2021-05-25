import React from "react";

export default function Help({
  isMulti,
  setIsMulti,
  setShowHelp,
  setEditMode
}) {
  const electionType = (isMulti) =>
    isMulti ? (
      <span className="smallcaps">Multi-Winner</span>
    ) : (
      <span className="smallcaps">Single-Winner</span>
    );

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
            <b>TIPS</b> on using the main menu:
            <ol>
              <li>
                Click <b>{electionType(isMulti)}</b> to see results for a{" "}
                {electionType(!isMulti)} election
              </li>
              <li>
                Click <b className="smallcaps">Edit</b> to paste in your own
                election results
              </li>
            </ol>
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
