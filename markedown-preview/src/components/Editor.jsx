import React from "react";

export default function Editor({ editorValue, setEditorValue }) {
  const handleChange = (event) => {
    const { value } = event.target;
    setEditorValue(value);
  };
  return (
    <div id="editor-container">
      <h1 className="title">Editor</h1>
      <textarea value={editorValue} onChange={handleChange} id="editor" />
    </div>
  );
}
