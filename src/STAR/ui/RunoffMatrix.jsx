import React, { useRef } from "react";
import useWidth from "../useWidth";
import { flattenSingle, flattenMulti } from "../flatten";

const view = 1;

function percentSupport(cell) {
  const votes = cell.supportVotes + cell.opposeVotes + cell.noPrefVotes;
  const percentage =
    votes === 0 ? 0 : Math.round((cell.supportVotes / votes) * 100);
  return `${percentage}%`;
}

function renderCell(cell, rowIndex, colIndex) {
  const key = `${rowIndex},${colIndex}`;
  let className = cell ? cell.result : "";
  if (view === 2) {
    className += " center";
  }
  const netVotes = cell ? (
    cell.netVotes > 0 ? (
      <span className="supportVotes">+{cell.netVotes}</span>
    ) : cell.netVotes < 0 ? (
      <span className="opposeVotes">{cell.netVotes}</span>
    ) : (
      "Tie"
    )
  ) : (
    ""
  );

  let content = "";
  if (cell) {
    switch (view) {
      case 0:
        content = netVotes;
        break;
      case 1:
        content = (
          <span>
            <span>{percentSupport(cell)}</span>&nbsp;
            <span className="smaller">
              <b>{netVotes}</b>
            </span>
          </span>
        );
        break;
      case 2:
        content = (
          <span>
            <b>
              <span class="supportVotes">{cell.supportVotes}</span>
              <span class="opposeVotes">{cell.opposeVotes}</span>
              <span class="noPrefVotes">{cell.noPrefVotes}</span>
            </b>
          </span>
        );
        break;
      default:
        content = cell.result;
    }
  }

  return (
    <td key={key} className={className}>
      {content}
    </td>
  );
}

export default function RunoffMatrix({
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
  const votes = cvr.voters.length;
  const undervotes = cvr.undervotes.length;
  //const bulletvotes = cvr.bulletvotes.length;
  const percentage = (count, total) => (
    <span>
      {(Number(count / total) * 100).toFixed()}%{" "}
      <span className="smaller">({count})</span>
    </span>
  );
  const approval = (row, index) =>
    percentage(
      row.support.slice(index).reduce((current, total) => current + total, 0),
      votes
    );
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
    const color = percentage > 0.5 ? "white" : "black";
    const hex = Math.round((1 - percentage) * 255)
      .toString(16)
      .padStart(2, "0");
    const background = "#".concat(hex, hex, hex);
    return {
      color: color,
      backgroundColor: background
    };
  };

  const greyVotes = (row, index) => {
    const value = index
      ? row.support.slice(index).reduce((current, total) => current + total, 0)
      : votes - row.support[0];
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

  return (
    <div className="widget">
      <div className="topline">
        <div>
          <h1 className="center">Step 2: Runoff</h1>
          {showHelp && (
            <div className="helpTip" style={{ maxWidth: tableWidth + 16 }}>
              Each cell shows voter preference for the candidate in that row
              versus that column.
            </div>
          )}
          <div>
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th></th>
                  {rows.map((row, n) => (
                    <th
                      key={row.name}
                      style={{ fontWeight: "normal", textAlign: "right" }}
                    >
                      <span className="larger">{row.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <th style={right}>
                      <span className="larger">
                        <b>{row.name}</b>
                      </span>
                    </th>
                    {rows.map((col, colIndex) =>
                      renderCell(matrix[rowIndex][colIndex], rowIndex, colIndex)
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
