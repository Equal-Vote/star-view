import React from "react";
import Rating from "./Rating";
import Compare from "./Compare";
import Support from "./Support";

export default function Candidate(props) {
  const { candidate, selected, onHover, cvr } = props;
  return (
    <div
      className="candidate"
      onMouseEnter={() => onHover(candidate, true)}
      onMouseLeave={() => onHover(candidate, false)}
    >
      <h4
        className={selected && selected.name === candidate.name ? "self" : ""}
      >
        {candidate.name}
      </h4>
      {selected ? (
        <Compare selected={selected} candidate={candidate} cvr={cvr} />
      ) : (
        <>
          <Rating rating={Number(candidate.averageScore)} />
          <Support {...props} candidate={candidate} />
        </>
      )}
    </div>
  );
}
