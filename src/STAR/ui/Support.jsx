import React from "react";

export default function Support({ candidate, scoreGradiant }) {
  const total = candidate.support.reduce((current, total) => total + current);
  const width = candidate.support.map((value) => (value / total) * 100);
  const offset = [
    100,
    width[1] + width[2] + width[3] + width[4] + width[5],
    width[2] + width[3] + width[4] + width[5],
    width[3] + width[4] + width[5],
    width[4] + width[5],
    width[5]
  ];

  const Bar = ({ index }) => (
    <rect
      width={width[index]}
      height="100"
      x={100 - offset[index]}
      y="0"
      fill={scoreGradiant[index]}
      strokeWidth="0"
    >
      <title>
        {candidate.support[index]} voter
        {candidate.support[index] === 1 ? "" : "s"} ({width[index].toFixed(0)}%)
        rated {candidate.name} {index} stars
      </title>
    </rect>
  );
  return (
    <div className="support">
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <Bar index="5" />
        <Bar index="4" />
        <Bar index="3" />
        <Bar index="2" />
        <Bar index="1" />
        <Bar index="0" />
      </svg>
    </div>
  );
}
