import React from "react";
import Candidate from "./Candidate";

export default function CandidateGroup({ section, onHover, selected, cvr }) {
  if (section.candidates.length === 0) return <div />;
  return (
    <>
      <h1 className="center">{section.title}</h1>
      {section.candidates.map((candidate, n) => (
        <div key={n} className="wrapper">
          <Candidate
            candidate={candidate}
            onHover={onHover}
            selected={selected}
            cvr={cvr}
          />
        </div>
      ))}
    </>
  );
}
