import React from "react";
import StarView from "./StarView";
import useSheet from "./useSheet";

export default function SheetLoader({ match }) {
  const docId = match.params.election;
  const sheetName = match.params.race;
  const [csv, error] = useSheet(docId, sheetName);

  if (!docId || !sheetName) {
    return <div>Invalid URL</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return csv ? <StarView csv={csv} title={sheetName} /> : <div>Loading...</div>;
}
