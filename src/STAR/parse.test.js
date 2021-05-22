import { parse } from "./parse";

test("1 + 2 = 3", () => {
  expect(1 + 2).toBe(3);
});

test("null is not not a number", () => {
  expect(isNaN(null)).toBe(false);
});

test("can parse Google Forms timestamp", () => {
  const text = "    7/24/2020 13:51:51";
  //const text="xxxx";
  const result = Date.parse(text);
  expect(isNaN(result)).toBe(false);
});

test("parse test string", () => {
  const csv = `Timestamp	Email Address	Electoral Science Forum 	Equal Vote Forum	Electoral Reform Forum
    7/24/2020 13:51:51	keith.edmonds@alumni.ubc.ca	5		0
    7/24/2020 14:48:19	toby@tobypereira.co.uk	3	1	2
    7/24/2020 14:48:19	nobody@nowhere.org	0	0	0
    7/24/2020 15:05:00	rjbrown@gmail.com	2	0	1`;

  const json = parse(csv);
  //console.log(json);
  expect(json).toBeDefined();
});

test("parse simple csv string", () => {
  const csv = `voterId;A;B;C
V;0;0;5
W;4;0;3
X;0;0;0
Y;2;0;0
Z;1;5;0`;

  const json = parse(csv);
  //console.log(json);

  expect(json.undervotes.length).toBe(1);
  expect(json.undervotes[0].csvRow).toBe(3);

  expect(json.scores.length).toBe(3);
  expect(json.scores[0].length).toBe(4);
  expect(json.scores[1].length).toBe(4);
  expect(json.scores[2].length).toBe(4);
  expect(json.scores[0]).toEqual([0, 4, 2, 1]);
  expect(json.scores[1]).toEqual([0, 0, 0, 5]);
  expect(json.scores[2]).toEqual([5, 3, 0, 0]);

  expect(json.candidates.length).toBe(3);
  expect(json.candidates[0]).toEqual({
    name: "A",
    csvColumn: 1,
    index: 0,
    totalScore: 7,
    averageScore: "1.75",
    support: [1, 1, 1, 0, 1, 0]
  });
  expect(json.candidates[1]).toEqual({
    name: "B",
    csvColumn: 2,
    index: 1,
    totalScore: 5,
    averageScore: "1.25",
    support: [3, 0, 0, 0, 0, 1]
  });
  expect(json.candidates[2]).toEqual({
    name: "C",
    csvColumn: 3,
    index: 2,
    totalScore: 8,
    averageScore: "2.00",
    support: [2, 0, 0, 1, 0, 1]
  });

  expect(json.matrix.length).toBe(3);
  expect(json.matrix[0].length).toBe(3);
  expect(json.matrix[1].length).toBe(3);
  expect(json.matrix[2].length).toBe(3);
  expect(json.matrix[0][0]).toBeUndefined();
  expect(json.matrix[1][1]).toBeUndefined();
  expect(json.matrix[2][2]).toBeUndefined();
});

test("three-way tie", () => {
  const csv = `CC;BE;HH;KJ;TM;OP;AT;MT
3;2;5;5;4;5;1;2`;

  const json = parse(csv);
  expect(json.voters.length).toBe(1);
  expect(json.candidates.length).toBe(8);
  expect(json.singleResults.winners).toEqual([2, 3, 5]);
  expect(json.multiResults[0]).toEqual([2, 3, 5]);
});

test("tie breaking", () => {
  const csv = `A;B
5;4
5;4
4;5
3;5
`;

  const json = parse(csv);
  expect(json.voters.length).toBe(4);
  expect(json.candidates.length).toBe(2);
  expect(json.singleResults.winners).toEqual([1]);
  expect(json.singleResults.losers).toEqual([0]);
  expect(json.multiResults[0]).toEqual([1]);
  expect(json.multiResults[1]).toEqual([0]);
});
