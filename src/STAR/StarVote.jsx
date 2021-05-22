import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import StarBallot from "./ui/StarBallot";
//import StarView from "./StarView";
import useSheet from "./useSheet";
import parse from "./parse";

export default function StarVote({ match }) {
  const docId = match.params.election;
  const sheetName = match.params.race;
  const [csv, error] = useSheet(docId, sheetName);
  const [cvr, setCvr] = useState(null);
  const [ballot, setBallot] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (csv) {
      const json = parse(csv);
      console.log("CVR", json);
      setCvr(json);
    }
  }, [csv]);

  if (hasVoted) {
    //TODO: Retuning the control would be more efficient,
    // but we'd have to concatenate our vote to the bottom
    //return <StarView csv={csv} title={sheetName} />
    return <Redirect to={`/view/${docId}/${sheetName}`} />;
  }

  if (!docId || !sheetName) {
    return <div>Invalid URL</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!csv) {
    return <div>Loading...</div>;
  }

  if (!cvr) {
    return <div>Parsing...</div>;
  }

  const candidates = cvr.candidates.map((candidate) => {
    return { candidate: candidate.name };
  });

  const handleUpdate = (rankings, hasErrors) => {
    console.log("Update", rankings, hasErrors);
    setBallot(rankings);
  };

  const castBallot = () => {
    const server = "https://ipo2020-dev-appservice.azurewebsites.net";
    const apikey = "mS/BqUFdzqALY4EHLaqML1dys99r3eJde0Psq8jcbqmhFjGgsQllMQ==";
    const baseURL = `${server}/api/CastVote`;
    const choices = ballot.join(",");
    const url = `${baseURL}?code=${apikey}&election=${docId}&race=${sheetName}&vote=${choices}`;
    console.log(url);
    fetch(url);
    setHasVoted(true);
  };

  return (
    <div className="wrapper">
      <div>
        <StarBallot
          race={`${sheetName} Election`}
          candidates={candidates}
          onUpdate={handleUpdate}
        />
        <button className="primary submit" onClick={castBallot}>
          Submit
        </button>
      </div>
    </div>
  );
}
