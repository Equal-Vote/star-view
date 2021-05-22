import React, { useState } from "react";
import StarView from "./StarView";

export default function SheetLoader({ match, location }) {
  const docId = match.params.election;
  const sheetName = match.params.race;
  console.log("SheetLoader", docId, sheetName);
  const [csv, setCsv] = useState(null);
  const star_url = `https://star.vote/poll/csv/${poll}/`;
  const cors_api_url = "https://cors-anywhere.herokuapp.com/";
  const url = cors_api_url.concat(star_url);
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  };
  fetch(url, options)
    .then((response) => response.json())
    .then(handleResponse);

  return csv ? <StarView csv={csv} title={title} /> : <div>Loading...</div>;
}

function handleResponse(json) {
  console.log(json);
}
