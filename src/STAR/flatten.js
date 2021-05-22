function flatten(cvr, sections) {
  const flattened = sections.map((section) => {
    return {
      title: section.title,
      candidates: section.candidates.map((index) => cvr.candidates[index])
    };
  });

  const candidates = [];
  flattened.forEach((section, n) => candidates.push(...section.candidates));
  const ordering = candidates.map((candidate) => candidate.index);
  const matrix = ordering.map((i) => ordering.map((j) => cvr.matrix[i][j]));
  const results = {
    sections: flattened,
    candidates: candidates,
    matrix: matrix
  };
  console.log("results", results);
  return results;
}

function flattenSingle(cvr) {
  const data = cvr.singleResults;
  const sections = [
    {
      title: data.winners.length > 1 ? "Winner (TIE)" : "Winner",
      candidates: data.winners
    },
    {
      title: data.losers.length > 1 ? "Runner-Up (TIE)" : "Runner Up",
      candidates: data.losers
    },
    {
      title: "Other Candidates",
      candidates: data.others
    }
  ];
  return flatten(cvr, sections);
}

function flattenMulti(cvr) {
  const data = cvr.multiResults;
  const sections = data.map((candidates, n) => {
    return {
      title: `${position(n + 1)} Place${candidates.length > 1 ? " (TIE)" : ""}`,
      candidates: candidates
    };
  });
  return flatten(cvr, sections);
}

function position(number) {
  const numberString = Number(number).toFixed(0).toString();
  const lastDigit = numberString.substr(-1);
  const suffix =
    lastDigit === "1"
      ? "st"
      : lastDigit === "2"
      ? "nd"
      : lastDigit === "3"
      ? "rd"
      : "th";
  return `${numberString}${suffix}`;
}

export { flattenSingle, flattenMulti, flatten };
