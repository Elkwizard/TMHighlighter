import { resolveTheme } from "./themes.js";
import { lex } from "./lex.js";

function escapeHTML(content) {
	return content
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\r?\n/g, "<br>");
}

export function highlight(text, syntax, theme = "DEFAULT") {
	const tokens = lex(text, syntax);
	theme = resolveTheme(theme);

	return tokens
		.map(token => {
			const content = escapeHTML(token.content);
			const color = theme.getColor(token.names);
			return `<span style="color: ${color};">${content}</span>`;
		})
		.join("");
}