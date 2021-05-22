import data from "./metavote.csv";
import parse from "../STAR/parse";

test("metavote", () => {
  const json = parse(data);
  expect(json).toBeDefined();
});
