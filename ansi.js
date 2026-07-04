import { lex } from "./lex.js";
import { resolveTheme } from "./themes.js";

function hexToRGB(hex) {
	hex = hex.slice(1);

	if (hex.length === 3)
		hex = hex.replace(/(.)/g, "$1$1");
	
	return hex
		.match(/../g)
		.map(ch => parseInt(ch, 16));
}

function hexToAnsi(hex) {
	return `\x1b[38;2;${hexToRGB(hex).join(";")}m`;
}

export function highlight(text, syntax, theme = "DEFAULT") {
	const tokens = lex(text, syntax);
	theme = resolveTheme(theme);

	return tokens
		.map(token => {
			const color = theme.getColor(token.names);
			const ansi = hexToAnsi(color);
			return `\x1b[${ansi}${token.content}\x1b[0m`;
		})
		.join("");
}