import React, { useState, useEffect } from "react";
import "./styles.css";
import Banner from "./ui/Banner";
import Edit from "./ui/Edit";
import Help from "./ui/Help";
import Results from "./ui/Results";
import data from "./sample0";
import { parse } from "./parse";

export default function StarView(props) {
  const [isMulti, setIsMulti] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [title, setTitle] = useState(
    props.title ? props.title : "Sample Election"
  );
  const [csv, setCsv] = useState(props.csv ? props.csv : data);
  const [cvr, setCvr] = useState(null);
  //HACK: This is needed to get helpTip width set properly
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // const input = showHelp || !csv ? data : csv;
    const input = csv;
    const json = parse(input);
    setCvr(json);

    if (initialized) {
      window.dispatchEvent(new Event("resize"));
    } else {
      setInitialized(true);
    }
  }, [csv, showHelp, initialized]);

  const handleCancel = () => {
    setEditMode(false);
    setInvalid(false);
  };
  const handleSave = (csv, title) => {
    if (!parse(csv)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (csv) setCsv(csv);
    if (title) setTitle(title);
    setEditMode(false);
    setShowHelp(false);
  };

  return (
    <div className="App">
      <Banner
        isMulti={isMulti}
        setIsMulti={setIsMulti}
        editMode={editMode}
        setEditMode={setEditMode}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />
      {showHelp && !editMode && (
        <Help
          isMulti={isMulti}
          setIsMulti={setIsMulti}
          setShowHelp={setShowHelp}
          setEditMode={setEditMode}
        />
      )}
      <div className="wrapper">
        {!editMode && cvr && (
          <Results
            title={title}
            cvr={cvr}
            isMulti={isMulti}
            showHelp={showHelp}
          />
        )}
      </div>
      {editMode && (
        <Edit
          csv={csv}
          title={title}
          onCancel={handleCancel}
          onSave={handleSave}
          invalid={invalid}
        />
      )}
    </div>
  );
}
