import React from "react";
import Candidate from "./Candidate";

export default function CandidateGroup(props) {
  const { section } = props;
  if (section.candidates.length === 0) return <div />;
  const titleClass =
    section.title === "Winner"
      ? "winner"
      : section.title === "Runner Up"
      ? "runnerup"
      : section.title === "Other Candidates"
      ? "other"
      : "";
  return (
    <>
      <h3 className={titleClass}>{section.title}</h3>
      {section.candidates.map((candidate, n) => (
        <div key={n} className={`wrapper ${titleClass}`}>
          <Candidate {...props} titleClass={titleClass} candidate={candidate} />
        </div>
      ))}
    </>
  );
}
