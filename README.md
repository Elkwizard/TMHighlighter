# TMHighlighter
This is a utility library to highlight text (either using HTML \<spans> or ANSI escapes) based on JSON TextMate grammars, as they appear in VSCode Extensions. To use the library, simply import `highlight` from `ansi.js` or `html.js`.
Then, pass the text to be highlighted as the first argument and the grammar text as the second argument.
For example:

```js
import fs from "node:fs";
import { highlight } from "TMHighlighter/ansi.js"; // use ANSI escapes for coloring

const [file, grammar] = await Promise.all([
  fs.promises.readFile("file.sometype", "utf-8"), // the file described by the syntax
  fs.promises.readFile("syntax.tmLanguage.json", "utf-8") // the TextMate syntax
]);

console.log(highlight(file, JSON.parse(grammar));
```
