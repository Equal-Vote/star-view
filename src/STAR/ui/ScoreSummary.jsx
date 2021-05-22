import React, { useRef } from "react";
import useWidth from "../useWidth";
import { flattenSingle, flattenMulti } from "../flatten";

export default function Enthusiasm({
  title,
  cvr,
  showHelp,
  isMulti,
  selected,
  onHover
}) {
  const tableRef = useRef();
  const tableWidth = useWidth(tableRef);

  // Create a flattended list of rows
  const { sections, candidates, matrix } = isMulti
    ? flattenMulti(cvr)
    : flattenSingle(cvr);
  const rows = [];
  sections.forEach((section, n) => rows.push(...section.candidates));
  console.log("rows", rows, sections);
  const votes = cvr.voters.length;
  const undervotes = cvr.undervotes.length;
  //const bulletvotes = cvr.bulletvotes.length;
  const percentage = (count, total) => (
    <span>
      <span>{total === 0 ? 0 : (Number(count / total) * 100).toFixed()}%</span>
      &nbsp;
      <span className="smaller">
        <b>{count}</b>
      </span>
    </span>
  );
  const approval = (row, index) =>
    row.support[index] > 0 ? percentage(row.support[index], votes) : "";
  // const approval = (row, index) =>
  // percentage(
  //   row.support.slice(index).reduce((current, total) => current + total, 0),
  //   votes
  // );

  const colors = [
    "#e0e0e0",
    "#b5d2a9",
    "#83d475",
    "#57c84d",
    "#2eb62c",
    "#019021"
  ];
  const bg = (index) => {
    return {
      backgroundColor: colors[index],
      color: index ? "#ffffff" : "#000000",
      textAlign: "center"
    };
  };
  const grey = (percentage) => {
    const color = percentage >= 0.5 ? "white" : "black";
    //    const hex = Math.round((1 - percentage) * 255)
    const hex = Math.round((1 - percentage) * 255)
      .toString(16)
      .padStart(2, "0");
    const background = "#".concat(hex, hex, hex);
    return {
      color: color,
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

  const greyStar = (value) => {
    const style = grey(value);
    style.textAlign = "center";
    return style;
  };
  const left = { textAlign: "left" };
  const right = { textAlign: "right" };
  const center = { textAlign: "center" };
  const colHead = { textAlign: "left", fontWeight: "400" };

  return (
    <div className="widget">
      <div className="topline">
        <div className="enthusiasm">
          <h1 className="center">Step 1: Score</h1>
          {showHelp && (
            <div className="helpTip" style={{ maxWidth: tableWidth + 16 }}>
              Each cell shows how many voters assigned the candidate in that row
              the score in that column.
            </div>
          )}
          <div>
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th style={colHead}>Candidate</th>
                  <th style={colHead}>Stars</th>
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
                    <th style={right}>
                      {/* <span className="smaller">{n + 1}</span>&nbsp;&nbsp; */}
                      <span className="larger">
                        <b>{row.name}</b>
                      </span>
                    </th>
                    <td style={greyStar(row.averageScore / 5)}>
                      {row.averageScore}
                    </td>
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
        {/*
      <div className="votetotal">
        <h3>Notes:</h3>
        <ul>
          <li>
            {votes} voters {undervotes ? `plus ${undervotes} undervotes` : ""}
          </li>
          {/* <li>
            {bulletvotes ? (
              <span>{percentage(bulletvotes, votes)} were bullet votes</span>
            ) : (
              <span>No bullet votes</span>
            )}
          </li> * /}
        </ul>
      </div>
        */}
      </div>
    </div>
  );
}
