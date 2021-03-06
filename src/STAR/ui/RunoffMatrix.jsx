import React, { useState, useRef, useEffect } from "react";
import useWidth from "../useWidth";
import { flattenSingle, flattenMulti } from "../flatten";

export default function RunoffMatrix({ cvr, showHelp, isMulti }) {
  const [view, setView] = useState(0);
  const nextView = () => setView((view + 1) % 2);

  function percentSupport(cell) {
    const votes = cell.supportVotes + cell.opposeVotes + cell.noPrefVotes;
    const percentage =
      votes === 0 ? 0 : Math.round((cell.supportVotes / votes) * 100);
    return `${percentage}%`;
  }

  const getClass = (n, suffix = "") =>
    n < winnerCount
      ? `winner ${suffix}`
      : n < minLightRowCol
      ? `runnerup ${suffix}`
      : suffix;

  function renderCell(
    cell,
    rowIndex,
    colIndex,
    minLightRowCol,
    winnerCount,
    runnerUpCount
  ) {
    const isSpecial = rowIndex < minLightRowCol && colIndex < minLightRowCol;
    const bgShade = isSpecial ? "dark" : "light";
    const textShade = isSpecial ? "light" : "dark";
    const prefix =
      cell && cell.netVotes > 0
        ? "win"
        : cell && cell.netVotes < 0
        ? "lose"
        : "";
    const cellStyle =
      prefix && rowIndex !== colIndex
        ? {
            color: `var(--${prefix}-${textShade})`,
            backgroundColor: `var(--${prefix}-${bgShade})`
          }
        : null;
    const key = `${rowIndex},${colIndex}`;

    const netVotes = cell ? (
      cell.netVotes > 0 ? (
        <span>+{cell.netVotes}</span>
      ) : cell.netVotes < 0 ? (
        <span>{cell.netVotes}</span>
      ) : (
        "Tie"
      )
    ) : (
      ""
    );

    if (rowIndex === colIndex) {
      return <td key={key} className={getClass(rowIndex)}></td>;
    } else if (cell) {
      switch (view) {
        case 0:
          return (
            <td key={key} style={cellStyle}>
              <span>
                <span className="percent">{percentSupport(cell)}</span>&nbsp;
                <span className="count">{netVotes}</span>
              </span>
            </td>
          );
        case 1:
          return (
            <td key={key}>
              <span>
                <b>
                  <span className="supportVotes">{cell.supportVotes}</span>
                  <span className="opposeVotes">{cell.opposeVotes}</span>
                  <span className="noPrefVotes">{cell.noPrefVotes}</span>
                </b>
              </span>
            </td>
          );
        default:
      }
    }
    return <td key={key} />;
  }

  const tableRef = useRef();
  const tableWidth = useWidth(tableRef);
  useEffect(() => {
    if (tableWidth === 0) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [tableWidth]);

  // Create a flattended list of rows
  const { sections, matrix } = isMulti ? flattenMulti(cvr) : flattenSingle(cvr);
  const winnerCount = isMulti ? 0 : sections[0].candidates.length;
  const runnerUpCount = isMulti ? 0 : sections[1].candidates.length;
  const minLightRowCol = winnerCount + runnerUpCount;
  const rows = [];
  sections.forEach((section, n) => rows.push(...section.candidates));

  return (
    <div className="widget runoff">
      <h1>
        <span className="smallcaps">Step 2</span>: <i>Runoff</i>
      </h1>
      {showHelp && (
        <div className="helpTip" style={{ maxWidth: tableWidth + 16 }}>
          <p>
            Each cell shows voter preference for the candidate in that row
            versus that column.
          </p>
          <p>
            <b>TIP</b>: Click the column headings to toggle between displaying{" "}
            <i>net votes</i> versus counts of{" "}
            <i>support&nbsp;/&nbsp;oppose&nbsp;/&nbsp;no&nbsp;preference</i>.
          </p>
        </div>
      )}
      <div>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th className="empty"></th>
              <th className="versus">Versus</th>
            </tr>
            <tr>
              <th className="name">Candidate</th>
              {rows.map((row, n) => (
                <th
                  className={getClass(n)}
                  key={row.name}
                  onClick={nextView}
                  style={{ cursor: "pointer" }}
                >
                  {row.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className={getClass(rowIndex, "name")}>{row.name}</td>
                {rows.map((col, colIndex) =>
                  renderCell(
                    matrix[rowIndex][colIndex],
                    rowIndex,
                    colIndex,
                    minLightRowCol,
                    winnerCount,
                    runnerUpCount
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
