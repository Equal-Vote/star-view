import React from "react";
import Rating from "./Rating";
import Compare from "./Compare";
import Support from "./Support";

export default function Candidate(props) {
  const { candidate, selected, onHover, cvr } = props;
  return (
    <div
      className="center fullwidth"
      onMouseEnter={() => onHover(candidate, true)}
      onMouseLeave={() => onHover(candidate, false)}
    >
      <h2
        className={selected && selected.name === candidate.name ? "self" : ""}
      >
        <b>{candidate.name}</b>
      </h2>
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
