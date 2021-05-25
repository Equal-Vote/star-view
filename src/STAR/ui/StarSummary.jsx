import React, { useRef, useState } from "react";
import useWidth from "../useWidth";
import CandidateGroup from "./CandidateGroup";
import { flattenSingle, flattenMulti } from "../flatten";

export default function StarSummary(props) {
  const tableRef = useRef();
  const tableWidth = useWidth(tableRef);

  const { cvr, showHelp, isMulti } = props;
  const votes = cvr.voters.length;
  const undervotes = cvr.undervotes.length;
  const { sections } = isMulti ? flattenMulti(cvr) : flattenSingle(cvr);

  const [view, setView] = useState(0);

  return (
    <div className="widget">
      <div className="summary">
        <h1 onClick={() => setView((view + 1) % 3)}>{props.title}</h1>
        <h2>
          {votes} voters {undervotes ? `plus ${undervotes} undervotes` : ""}
        </h2>
        {showHelp && (
          <div
            className="helpTip"
            style={{ maxWidth: tableWidth - 16, marginLeft: 8, marginRight: 8 }}
          >
            <p>
              {isMulti
                ? "In a Multi-Winner election, the single-winner tabulation process is repeated until all candidates have been ranked."
                : "In a Single-Winner election, the winner is shown first, followed by the runner-up finalist, then the other candidates by descending total score."}
            </p>
          </div>
        )}
        <div ref={tableRef}>
          {sections.map((section, n) => (
            <CandidateGroup
              {...props}
              key={isMulti ? `m${n}` : `s${n}`}
              section={section}
              view={view}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
