function resolveIncludes(node, repository) {
	node.patterns = node.patterns?.flatMap(pattern => {
		if (pattern.include)
			return repository[pattern.include.slice(1)];
		return [pattern];
	});

	return node;
}

function* visitPatterns(syntax, root = true, names = []) {
	if (syntax.name) names = [...names, syntax.name];

	const types = ["match", "begin"];
	if (root) types.push("end");

	for (const key of types)
		if (syntax[key])
			yield { type: key, match: syntax[key], names, syntax };

	if ((root || !syntax.begin) && syntax.patterns) {
		for (const pattern of syntax?.patterns)
			yield* visitPatterns(pattern, false, names);
	}
}

function parseRegex(regex) {
	return new RegExp(regex, "mg");
}

function tryLex(text, syntax, state = { index: 0, names: [] }) {
	const createToken = (content, names) => ({
		content, names: [...state.names, ...names]
	});
	const matches = [...visitPatterns(syntax)]
		.map(pattern => {
			const regex = parseRegex(pattern.match);
			regex.lastIndex = state.index;
			const match = regex.exec(text);
			if (!match) return null;
			return {
				pattern,
				content: match[0],
				index: match.index
			};
		})
		.filter(Boolean);

	const nearest = Math.min(...matches.map(match => match.index));

	if (nearest === Infinity)
		return [createToken(text.slice(state.index), [])];

	const match = matches.find(match => match.index === nearest);

	const nextIndex = match.index + match.content.length;

	const result = [];
	if (match.index > state.index)
		result.push(createToken(text.slice(state.index, match.index), []));

	result.push(
		createToken(text.slice(match.index, nextIndex), match.pattern.names),
	);

	state.index = nextIndex;
	if (match.pattern.type === "begin") {
		const oldLength = state.names.length;
		state.names.push(...match.pattern.names);
		result.push(
			...tryLex(text, match.pattern.syntax, state)
		);
		state.names.length = oldLength;
	} else if (match.pattern.type === "end") {
		return result;
	}

	result.push(
		...tryLex(text, syntax, state)
	);

	return result;
}

export function lex(text, syntax) {
	const { repository } = syntax;
	const root = resolveIncludes(
		{ patterns: syntax.patterns },
		repository
	);

	return tryLex(text, root);
}