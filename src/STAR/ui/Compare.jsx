import React from "react";

export default function Compare({ candidate, selected, cvr }) {
  const percentage = (count, total) => (
    <span>
      <b>{(Number(count / total) * 100).toFixed()}%</b>{" "}
      <span className="smaller">({count})</span>
    </span>
  );
  const pct = count => percentage(count, cvr.voters.length);
  if (candidate === selected) {
    const raceCount = result => {
      var count = 0;
      for (let index = 0; index < cvr.matrix.length; index++) {
        if (
          index !== selected.index &&
          result === cvr.matrix[selected.index][index].result
        )
          count++;
      }
      return count;
    };

    const win = raceCount("Win");
    const lose = raceCount("Lose");
    const tie = raceCount("TIE");
    var text;
    if (win > 0 && lose === 0 && tie === 0)
      text = (
        <span>
          Wins all races <span className="smaller">(Condorcet Winner)</span>
        </span>
      );
    else if (win === 0 && lose > 0 && tie === 0) text = "Loses all races";
    else if (win === 0 && lose === 0 && tie > 0) text = "Ties all races";
    else if (win > 0 && lose > 0 && tie === 0)
      text = `Wins ${win} and Loses ${lose}`;
    else if (win > 0 && lose === 0 && tie > 0)
      text = `Wins ${win} and Ties ${tie}`;
    else if (win === 0 && lose > 0 && tie === 0)
      text = `Wins ${win} and Ties ${tie}`;
    else text = `Wins ${win}, Loses ${lose}, and Ties ${tie}`;

    return (
      <div className="compare fullwidth self">
        <span className="h2h">Head-To-Head Race Comparison:</span>
        <br />
        {text}
        <div className="support">
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
        </div>
      </div>
    );
  }

  const compare = cvr.matrix[selected.index][candidate.index];
  return (
    <div className={"compare fullwidth ".concat(compare.result)}>
      vs {selected.name}
      <br />
      <span className="h2h">
        <span className="oppose">{pct(compare.opposeVotes)} </span>
        <span className={compare.result}>
          &nbsp;
          {pct(compare.supportVotes)}&nbsp; &nbsp;no pref:{" "}
          {pct(compare.noPrefVotes)}
        </span>
      </span>
    </div>
  );
}
