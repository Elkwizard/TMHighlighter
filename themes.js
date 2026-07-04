export class Theme {
	constructor(rules, normal) {
		this.rules = Object.entries(rules);
		this.nameToColor = new Map();
		this.normal = normal;
	}
	getNameColor(name) {
		if (!this.nameToColor.has(name)) {
			const [rule] = this.rules
				.filter(rule => name.startsWith(rule[0]))
				.sort((a, b) => b[0].length - a[0].length);

			this.nameToColor.set(name, rule?.[1]);
		}

		return this.nameToColor.get(name);
	}
	getColor(names) {
		for (let i = names.length - 1; i >= 0; i--) {
			const color = this.getNameColor(names[i]);
			if (color) return color;
		}
		return this.normal;
	}
}

const THEMES = {
	DEFAULT: new Theme({
		"comment": "#777",
		"variable": "#0ff",
		"constant.numeric": "#00f",
		"keyword.control": "#e5c",
		"storage.type": "#a5f",
		"entity.name.function": "#0f0",
		"keyword.operator": "#c44",
		"punctuation": "#558",
		"constant.character.escape": "#f90"
	}, "#ccc")
}

export function resolveTheme(theme) {
	if (theme instanceof Theme)
		return theme;

	return THEMES[theme];
}