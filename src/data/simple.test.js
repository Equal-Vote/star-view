import data from "./simple.csv";
import parse from "../STAR/parse";

test("test1 tie breaking", () => {
  const json = parse(data);
  const winners = json.singleResults.winners;
  const candidates = json.candidates;
  expect(winners.length).toBe(2);
  expect(candidates[winners[0]].name).toBe("Dylan");
  expect(candidates[winners[1]].name).toBe("Eliza");
});
