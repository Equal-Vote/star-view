import fs from "fs";
import path from "path";
import parse from "../STAR/parse";

// Read the fixture from disk rather than importing it.
//
// `import data from "./simple.csv"` does not do what it looks like it does
// under Create React App's jest config: an unknown extension is handled by
// fileTransform, which resolves the import to the *filename* string
// ("simple.csv") rather than the file's contents. parse() was therefore
// being handed a filename, returning null, and this test failed on
// `Cannot read properties of null` -- it had never passed.
//
// src/STAR/parse.test.js avoids the problem by inlining its CSV text.
const data = fs.readFileSync(path.join(__dirname, "simple.csv"), "utf8");

test("test1 tie breaking", () => {
  const json = parse(data);
  const winners = json.singleResults.winners;
  const candidates = json.candidates;
  expect(winners.length).toBe(2);
  expect(candidates[winners[0]].name).toBe("Dylan");
  expect(candidates[winners[1]].name).toBe("Eliza");
});
