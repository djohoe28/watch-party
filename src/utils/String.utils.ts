export function stringToColor(str: string | undefined) {
	// TODO: Dark Mode compatibility?
	if (!str) return "#000000"; // HACK: fallback to black

	let hash = 0;
	let i;

	for (i = 0; i < str.length; i += 1) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	return color;
}

export function stringToInitials(name: string) {
	if (name === DEFAULT_NAME) return null;
	const nameParts = name.trim().split(" ");
	if (nameParts.length === 1) {
		return nameParts[0][0];
	}
	return `${name.split(" ")[0][0]}${
		name.split(" ")[nameParts.length - 1][0]
	}`;
}

export function isColor(strColor: string) {
	// SEE: https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
	const s = new Option().style;
	s.color = strColor;
	return s.color !== "";
}

// Refactor to `DEFAULT_DISPLAY_NAME` ? (see `UserSettings.defaultName`)
export const DEFAULT_NAME = "(anon)";
