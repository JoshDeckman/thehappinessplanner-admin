import React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

import "../styles/mde.scss";
import "react-mde/lib/styles/css/react-mde-all.css";
import { ImageRounded } from "@material-ui/icons";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const MarkdownEditor = ({ text, onChange }) => {
  const [selectedTab, setSelectedTab] = React.useState("write");

  return (
    <div className="container">
      <ReactMde
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