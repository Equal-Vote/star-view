import Papa from "papaparse";
const minScore = 0;
const maxScore = 5;

// Parse a CSV string representing a CVR for a STAR election
export default function parse(csv) {
  // Start with vanilla CSV parsing and throw errors, if invalid
  var result = Papa.parse(csv, {
    dynamicTyping: true,
    header: false,
    skipEmptyLines: true,
    comments: "//"
  });
  if (result.errors.length > 0) {
    console.log("Parse Errors", result.errors);
    return null;
  }

  // First row of CSV is header, remaining rows are data
  const header = result.data[0];
  const data = result.data
    .slice(1)
    .filter((row) => row.some((col) => col !== null));
  return parseData(header, data);
}

function parseData(header, data) {
  // Inspect the data to determine the type of data in each column
  const transforms = getTransforms(header, data);

  // The list of candidates is based on the columns containing STAR scores
  const candidates = [];
  for (let i = 0; i < transforms.length; i++) {
    if (transforms[i] === transformScore) {
      const candidate = {
        name: transformAny(header[i]),
        index: candidates.length,
        csvColumn: i,
        totalScore: 0,
        support: new Array(6).fill(0)
      };
      candidates.push(candidate);
    }
  }

  // Initialize arrays
  const scores = Array(candidates.length);
  for (let i = 0; i < candidates.length; i++) {
    scores[i] = [];
  }
  const voters = [];
  const undervotes = [];
  const bulletvotes = [];

  // Parse each row of data into voter, undervote, and score arrays
  data.forEach((row, n) => {
    const voter = { csvRow: n + 1 };
    const score = [];
    let total = 0;
    let hasData = false;
    let candidatesSupported = 0;
    header.forEach((col, i) => {
      const value = transforms[i](row[i]);
      if (row[i] !== null && row[i] !== "") {
        hasData = true;
      }
      if (transforms[i] === transformScore) {
        score.push(value);
        total += value;
        if (value > 0) {
          candidatesSupported++;
        }
      } else {
        voter[col] = value;
      }
    });

    // Check for blank lines and undervote
    if (hasData) {
      if (total > 0) {
        for (let i = 0; i < score.length; i++) {
          scores[i].push(score[i]);
        }
        voters.push(voter);
        if (candidatesSupported === 1) {
          bulletvotes.push(voters.length - 1);
        }
      } else {
        undervotes.push(voter);
      }
    }
  });

  // Calculate totalScore and averageScore for each candidate
  voters.forEach((voter, v) => {
    candidates.forEach((candidate, c) => {
      candidate.totalScore += scores[c][v];
      candidate.support[scores[c][v]]++;
    });
  });

  candidates.forEach(
    (candidate) =>
      (candidate.averageScore = (voters.length === 0
        ? 0
        : candidate.totalScore / voters.length
      ).toFixed(2))
  );

  // Calculate head-to-head matrix of results
  const matrix = calculateMatrix(candidates, voters, scores);

  const candidateOrder = sortCandidates(candidates, matrix);
  const singleResults = splitCandidates(candidateOrder, candidates, matrix);
  const multiResults = splitMulti(singleResults, candidates, matrix);
  return {
    header,
    data,
    candidates,
    scores,
    voters,
    undervotes,
    bulletvotes,
    matrix,
    candidateOrder,
    singleResults,
    multiResults
  };
}

function splitMulti(single, candidates, matrix) {
  const multiResults = [];
  multiResults.push(single.winners);
  var remaining = [...single.losers, ...single.others];
  while (remaining.length > 0) {
    const results = splitCandidates(remaining, candidates, matrix);
    multiResults.push(results.winners);
    remaining = [...results.losers, ...results.others];
  }
  return multiResults;
}

// Calculate head-to-head matrix of results
function calculateMatrix(candidates, voters, scores) {
  const matrix = new Array(candidates.length);
  candidates.forEach((c, n) => (matrix[n] = new Array(candidates.length)));

  for (let a = 0; a < candidates.length - 1; a++) {
    for (let b = a + 1; b < candidates.length; b++) {
      const support = new Array(maxScore).fill(0);
      const oppose = new Array(maxScore).fill(0);
      let supportVotes = 0;
      let opposeVotes = 0;
      let noPrefVotes = 0;
      let netVotes = 0;
      let netSupport = 0;

      voters.forEach((voter, v) => {
        const delta = scores[a][v] - scores[b][v];
        netSupport += delta;
        if (delta === 0) {
          noPrefVotes++;
        } else if (delta > 0) {
          supportVotes++;
          netVotes++;
          support[delta - 1] += 1;
        } else {
          opposeVotes++;
          netVotes--;
          oppose[delta * -1 - 1] += 1;
        }
      });

      const totalScoreDelta =
        candidates[a].totalScore - candidates[b].totalScore;
      matrix[a][b] = {
        result:
          supportVotes > opposeVotes
            ? "Win"
            : supportVotes < opposeVotes
            ? "Lose"
            : totalScoreDelta > 0
            ? "Win"
            : totalScoreDelta < 0
            ? "Lose"
            : "TIE",
        supportVotes: supportVotes,
        support: support,
        opposeVotes: opposeVotes,
        oppose: oppose,
        netVotes: netVotes,
        netSupport: netSupport,
        noPrefVotes: noPrefVotes
      };

      matrix[b][a] = {
        result:
          supportVotes < opposeVotes
            ? "Win"
            : supportVotes > opposeVotes
            ? "Lose"
            : totalScoreDelta < 0
            ? "Win"
            : totalScoreDelta > 0
            ? "Lose"
            : "TIE",
        supportVotes: opposeVotes,
        support: oppose,
        opposeVotes: supportVotes,
        oppose: support,
        netVotes: -netVotes,
        netSupport: -netSupport,
        noPrefVotes: noPrefVotes
      };
    }
  }
  return matrix;
}

function splitCandidates(candidateOrder, candidates, matrix) {
  // Handle degenerate edge cases
  if (!candidateOrder || candidateOrder.length === 0) {
    return { winners: [], losers: [], others: [] };
  }

  if (candidateOrder.length === 1) {
    return { winners: candidateOrder, losers: [], others: [] };
  }

  // Helper function to retrive total score for a candidate
  const getScore = (index) => candidates[candidateOrder[index]].totalScore;

  // We know the first and second candidates in the sorted order are finalists
  // But second may be tied with third, fourth, etc
  const targetScore = getScore(1);
  var count = 2;

  for (let i = 2; i < candidateOrder.length; i++) {
    if (getScore(i) >= targetScore) {
      count++;
    } else {
      break;
    }
  }

  const finalists = candidateOrder.slice(0, count);
  const others = candidateOrder.slice(count);
  const { winners, losers } = splitWinners(finalists, candidates, matrix);
  return { winners, losers, others };
}

function splitWinners(finalists, candidates, matrix) {
  const { candidateOrder, votes } = sortFinalists(
    finalists,
    candidates,
    matrix
  );
  // Handle degenerate edge cases
  if (!candidateOrder || candidateOrder.length === 0) {
    return { winners: [], losers: [] };
  }
  if (candidateOrder.length === 1) {
    return { winners: candidateOrder, losers: [] };
  }

  const targetVotes = votes[0];
  const targetScore = candidates[finalists[0]].totalScore;
  var count = 1;

  for (let i = 1; i < candidateOrder.length; i++) {
    if (
      votes[i] === targetVotes &&
      candidates[finalists[i]].totalScore === targetScore
    ) {
      count++;
    } else {
      break;
    }
  }

  const winners = candidateOrder.slice(0, count);
  const losers = candidateOrder.slice(count);

  return { winners, losers };
}

function sortFinalists(finalists, candidates, matrix) {
  // Handle degenerate cases
  if (!finalists || finalists.length < 2)
    return { candidateOrder: finalists, votes: [0] };

  // Start by creating an array corresponding to total number of net votes each
  // candidate received over each of the other finalists
  const votes = new Array(finalists.length);

  for (let i = 0; i < finalists.length; i++) {
    let netVotes = 0;
    for (let j = 0; j < finalists.length; j++) {
      if (i === j) continue; // skip identity comparison
      netVotes += matrix[finalists[i]][finalists[j]].supportVotes;
    }
    votes[i] = netVotes;
  }

  // sort by votes descending, tie-break by retaining original order from CSV
  const compare = (a, b) =>
    votes[a] !== votes[b]
      ? votes[b] - votes[a]
      : candidates[finalists[a]].totalScore !==
        candidates[finalists[b]].totalScore
      ? candidates[finalists[b]].totalScore -
        candidates[finalists[a]].totalScore
      : a - b;
  let order = [];
  for (let i = 0; i < finalists.length; i++) order.push(i);
  order = order.sort(compare);
  const result = {
    candidateOrder: order.map((i) => finalists[i]),
    votes: order.map((i) => votes[i])
  };
  return result;
}

function sortCandidates(candidates, matrix) {
  // Start by creating an array corresponding to the index values
  // of the candidates array
  const order = [];
  for (let i = 0; i < candidates.length; i++) order.push(i);

  const sorted = order.sort((a, b) => {
    // Sort first by totalScore
    const aScore = candidates[a].totalScore;
    const bScore = candidates[b].totalScore;
    if (aScore > bScore) return -1;
    if (aScore < bScore) return 1;

    // Tie-break with head-to-head votes
    let head2head = matrix[a][b];
    if (head2head.supportVotes > head2head.opposeVotes) return -1;
    if (head2head.supportVotes < head2head.opposeVotes) return 1;

    // If it is a true tie, retain the ordering of the original CSV
    // That way, the user can reorder the columns of the CSV based
    // on their own tie-breaking rules and resubmit to have the
    // results displayed in order based on those rules.
    return a - b;
  });

  return sorted;
}

// Format a Timestamp value into a compact string for display;
function formatTimestamp(value) {
  const d = new Date(Date.parse(value));
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  const hour = d.getHours();
  const minute = d.getMinutes();

  const fullDate =
    year === currentYear
      ? `${month}/${date}`
      : year >= 2000 && year < 2100
      ? `${month}/${date}/${year - 2000}`
      : `${month}/${date}/${year}`;

  const timeStamp = `${fullDate} ${hour}:${minute}`;
  return timeStamp;
}

// Functions to parse STAR scores
const isScore = (value) =>
  !isNaN(value) && (value === null || (value > -10 && value < 10));
const transformScore = (value) =>
  value ? Math.min(maxScore, Math.max(minScore, value)) : 0;

// Functions to parse Timestamps
const isTimestamp = (value) => !isNaN(Date.parse(value));
const transformTimestamp = (value) => formatTimestamp(value);

// Functions to parse everything else
const isAny = (value) => true;
const transformAny = (value) => (value ? value.toString().trim() : "");

// Column types to recognize in Cast Vote Records passed as CSV data
const columnTypes = [
  { test: isScore, transform: transformScore },
  { test: isTimestamp, transform: transformTimestamp },
  // Last row MUST accept anything!
  { test: isAny, transform: transformAny }
];

function getTransforms(header, data) {
  const transforms = [];
  const rowCount = Math.min(data.length, 3);
  header.forEach((title, n) => {
    var transformIndex = 0;
    if (title === "Timestamp") {
      transformIndex = 1;
    } else {
      for (let i = 0; i < rowCount; i++) {
        const value = data[i][n];
        const index = columnTypes.findIndex((element) => element.test(value));
        if (index > transformIndex) {
          transformIndex = index;
        }
        if (transformIndex >= columnTypes.length) {
          break;
        }
      }
    }
    // We don't have to check for out-of-bound index because
    // the last row in columnTypes accepts anything
    transforms.push(columnTypes[transformIndex].transform);
  });
  return transforms;
}

export { parse, parseData };
