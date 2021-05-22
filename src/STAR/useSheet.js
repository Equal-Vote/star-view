import { useState } from "react";
const api = "https://ipo2020-dev-appservice.azurewebsites.net/api/ReadCsv";
const apiKey = "/A5NjaGWRw6vFC1VznbG1j2V2XuCzdmEZhli4l2FSYJLfOmRTmXDHw==";
export default function useSheet(docId, sheetName) {
  const [csv, setCsv] = useState(null);
  const [error, setError] = useState(null);

  function handleResponse(json) {
    console.log(json);
    const string = json.map((row) => row.join(";")).join("\n");
    setCsv(string);
  }

  const url =
    docId && sheetName
      ? `${api}?code=${apiKey}&election=${docId}&race=${sheetName}`
      : null;
  console.log("useSheet", url);
  if (url) {
    if (!csv) {
      fetch(url)
        .then((response) => response.json())
        .then(handleResponse)
        .catch((error) =>
          setError(
            "Check your URL and make sure metavote@metavote.iam.gserviceaccount.com has Editor permission"
          )
        );
    }
  }

  return [csv, error];
}
