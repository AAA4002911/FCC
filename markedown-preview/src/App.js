import React, { useState } from "react";
import "./index.css";
import Editor from "./components/Editor";
import Preview from "./components/Previewer";
const initialHTML = `# Hi!

## Welcome to my React previewer

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**
Or _italic_.
Or **_both!_**
And  ~~cross stuff out~~ if you want to.

There's also [links](https://codepen.io/bmansk14/), and
> Block Quotes

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

export default function App() {
  const [editorValue, setEditorValue] = useState(initialHTML);

  return (
    <>
      <Editor editorValue={editorValue} setEditorValue={setEditorValue} />
      <Preview editorValue={editorValue} />
    </>
  );
}
