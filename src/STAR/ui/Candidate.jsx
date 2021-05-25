import React from "react";
import Rating from "./Rating";
import Support from "./Support";

export default function Candidate(props) {
  const { candidate, titleClass, view, selected, onHover, cvr } = props;
  var className = `name ${titleClass}`;

  const viewClass =
    view === 1
      ? "horizontal"
      : view === 2
      ? "horizontal starsonly"
      : "candidate";

  return (
    <div className={viewClass}>
      <div className={className}>{candidate.name}</div>
      <Rating rating={Number(candidate.averageScore)} />
      <Support {...props} candidate={candidate} />
    </div>
  );
}
