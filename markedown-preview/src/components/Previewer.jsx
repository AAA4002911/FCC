import React from "react";
const marked = require("marked");

export default function Preview(props) {
  marked.setOptions({
    breaks: true
  });
  const renderer = new marked.Renderer();
  marked.use({ renderer });

  function createMarkup() {
    return { __html: marked(props.editorValue) };
  }

  return (
    <div id="preview-container">
      <h1 className="title">Previewer</h1>
      <div dangerouslySetInnerHTML={createMarkup()} id="preview" />
    </div>
  );
}
