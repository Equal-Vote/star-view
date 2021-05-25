import React from "react";
import Rating from "./Rating";
import Compare from "./Compare";
import Support from "./Support";

export default function Candidate(props) {
  const { candidate, titleClass, selected, onHover, cvr } = props;
  var className = `name ${titleClass} ${
    selected && selected.name === candidate.name ? "self" : "self"
  }`;
  return (
    <div
      className="candidate"
      onMouseEnter={() => onHover(candidate, true)}
      onMouseLeave={() => onHover(candidate, false)}
    >
      <h4 className={className}>{candidate.name}</h4>
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
