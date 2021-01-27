import React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

import "../styles/mde.scss";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const enabledToolbarCommands = [
[
  "header",
  "bold",
  "italic",
  "strikethrough"
],
[
  "link"
],
[
  "unordered-list",
  "ordered-list",
  "checked-list"
]
];

const MarkdownEditor = ({ text, onChange }) => {
  const [selectedTab, setSelectedTab] = React.useState("write");

  return (
    <div className="container">
      <ReactMde
        toolbarCommands={enabledToolbarCommands}
        id="description"
        value={text}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        childProps={{
          writeButton: {
            tabIndex: -1
          }
        }}
      />
    </div>
  );
};

export default MarkdownEditor;