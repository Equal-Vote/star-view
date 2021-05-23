import React, { useState } from "react";
import StarSummary from "./StarSummary";
import RunoffMatrix from "./RunoffMatrix";
import ScoreSummary from "./ScoreSummary";
import { scoreGradiant } from "./themeColors";

export default function Results(props) {
  const [selected, setSelected] = useState(null);
  const [gradiant, setGradiant] = useState(0);

  const nextGradiant = () => setGradiant((gradiant + 1) % scoreGradiant.length);

  const handleHover = (candidate, active) => {
    setSelected(null);
    /*
    if (active) {
      setSelected(candidate);
    } else if (selected === candidate) {
      setSelected(null);
    }
    */
  };
  const cvr = props.cvr;
  const voters = cvr.voters.length;
  const candidates = cvr.candidates.length;
  const undervotes = cvr.undervotes.length;

  if (voters === -1) {
    return (
      <div>
        <h1>Invalid Election Data</h1>
        <ul>
          <li>{voters} votes</li>
          <li>{undervotes} undervotes</li>
          <li>{candidates} candidates</li>
        </ul>
      </div>
    );
  }

  return (
    <>
      <StarSummary
        {...props}
        scoreGradiant={scoreGradiant[gradiant]}
        onHover={handleHover}
        selected={selected}
      />
      <div>
        <ScoreSummary
          {...props}
          scoreGradiant={scoreGradiant[gradiant]}
          nextScoreGradiant={nextGradiant}
          onHover={handleHover}
          selected={selected}
        />
        <RunoffMatrix {...props} onHover={handleHover} selected={selected} />
      </div>
    </>
  );
}
