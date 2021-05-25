import React, { useRef, useEffect } from "react";
import useWidth from "../useWidth";
import { flattenSingle, flattenMulti } from "../flatten";

export default function ScoreSummary(props) {
  const {
    cvr,
    showHelp,
    isMulti,
    selected,
    onHover,
    scoreGradiant,
    nextScoreGradiant
  } = props;
  const tableRef = useRef();
  const tableWidth = useWidth(tableRef);
  useEffect(() => {
    if (tableWidth === 0) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [tableWidth]);

  // Create a flattended list of rows
  const { sections } = isMulti ? flattenMulti(cvr) : flattenSingle(cvr);
  const rows = [];
  sections.forEach((section, n) => rows.push(...section.candidates));
  const votes = cvr.voters.length;
  const winnerCount = isMulti ? 0 : sections[0].candidates.length;
  const runnerUpCount = isMulti ? 0 : sections[1].candidates.length;
  const minLightRowCol = winnerCount + runnerUpCount;

  const percentage = (count, total) => (
    <span>
      <span className="percent">
        {total === 0 ? 0 : (Number(count / total) * 100).toFixed()}%
      </span>
      &nbsp;
      <span className="count">{count}</span>
    </span>
  );
  const approval = (row, index) =>
    row.support[index] > 0 ? percentage(row.support[index], votes) : "";
  // const approval = (row, index) =>
  // percentage(
  //   row.support.slice(index).reduce((current, total) => current + total, 0),
  //   votes
  // );

  const bg = (index) => {
    return {
      backgroundColor: scoreGradiant[index],
      fontSize: "1.5em",
      padding: "0",
      color: "#ffffff",
      textAlign: "center",
      cursor: "pointer"
    };
  };
  const interpolate = (min, max, percentage) => min + (max - min) * percentage;

  const grey = (percentage) => {
    const H = interpolate(180, 193, percentage);
    const S = interpolate(20, 97, percentage);
    const L = interpolate(95, 27, percentage);
    const background = `hsl(${H}, ${S}%, ${L}%)`;
    return {
      backgroundColor: background
    };
  };
  /*
  const greyVotes = (row, index) => {
    const value = index
      ? row.support.slice(index).reduce((current, total) => current + total, 0)
      : votes - row.support[0];
    return grey(value / votes);
  };
*/
  const greyVotes = (row, index) => {
    const value = row.support[index];
    return grey(value / votes);
  };

  const getClass = (n) =>
    n < winnerCount
      ? "winner name"
      : n < minLightRowCol
      ? "runnerup name"
      : "name";

  return (
    <div className="widget score">
      <h1>
        <span className="smallcaps">Step 1</span>: <i>Score</i>
      </h1>
      {showHelp && (
        <div className="helpTip" style={{ maxWidth: tableWidth + 16 }}>
          <p>
            Each cell shows how many voters assigned the candidate in that row
            the score in that column.
          </p>
          <p>
            <b>TIP</b>: Click the column headings to change the{" "}
            <i>color coding</i> of 0-5 votes.
          </p>
        </div>
      )}
      <div>
        <table ref={tableRef}>
          <thead>
            <tr onClick={nextScoreGradiant}>
              <th className="name">Candidate</th>
              <th className="average">
                Star
                <br />
                Average
              </th>
              <th style={bg(0)}>0</th>
              <th style={bg(1)}>1</th>
              <th style={bg(2)}>2</th>
              <th style={bg(3)}>3</th>
              <th style={bg(4)}>4</th>
              <th style={bg(5)}>5</th>
              {/* <th style={bg(0)}>Zero</th> */}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, n) => (
              <tr
                key={n}
                className={
                  selected && selected.name === row.name ? "selected" : ""
                }
                onMouseEnter={() => onHover(row, true)}
                onMouseLeave={() => onHover(row, false)}
              >
                <td className={getClass(n)}>{row.name}</td>
                <td className="average">{row.averageScore}</td>
                <td style={greyVotes(row, 0)}>{approval(row, 0)}</td>
                <td style={greyVotes(row, 1)}>{approval(row, 1)}</td>
                <td style={greyVotes(row, 2)}>{approval(row, 2)}</td>
                <td style={greyVotes(row, 3)}>{approval(row, 3)}</td>
                <td style={greyVotes(row, 4)}>{approval(row, 4)}</td>
                <td style={greyVotes(row, 5)}>{approval(row, 5)}</td>
                {/* <td style={grey(row, 0)}>{enthusiasm(row, 0)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
