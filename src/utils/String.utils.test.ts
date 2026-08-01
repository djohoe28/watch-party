import { describe, expect, it } from "vitest";
import { DEFAULT_NAME, isColor, stringToColor, stringToInitials } from "./String.utils";

describe("stringToColor", () => {
	it("returns black fallback for undefined input", () => {
		expect(stringToColor(undefined)).toBe("#000000");
	});

	it("returns black fallback for empty string", () => {
		expect(stringToColor("")).toBe("#000000");
	});

	it("is deterministic for the same input", () => {
		expect(stringToColor("abc123")).toBe(stringToColor("abc123"));
	});

	it("returns a valid 7-character hex color", () => {
		expect(stringToColor("some-user-id")).toMatch(/^#[0-9a-f]{6}$/);
	});

	it("produces different colors for different inputs (no trivial collision)", () => {
		expect(stringToColor("alice")).not.toBe(stringToColor("bob"));
	});
});

describe("stringToInitials", () => {
	it("returns null for the default (anon) name", () => {
		expect(stringToInitials(DEFAULT_NAME)).toBeNull();
	});

	it("returns the first letter for a single-word name", () => {
		expect(stringToInitials("Madonna")).toBe("M");
	});

	it("returns first+last initials for a multi-word name", () => {
		expect(stringToInitials("Jane Doe")).toBe("JD");
	});

	it("uses the first and last parts of a name with more than two words", () => {
		expect(stringToInitials("Jane Middle Doe")).toBe("JD");
	});
});

describe("isColor", () => {
	it("accepts a valid named color", () => {
		expect(isColor("red")).toBe(true);
	});

	it("accepts a valid hex color", () => {
		expect(isColor("#ff0000")).toBe(true);
	});

	it("rejects an invalid color string", () => {
		expect(isColor("not-a-color")).toBe(false);
	});
});
