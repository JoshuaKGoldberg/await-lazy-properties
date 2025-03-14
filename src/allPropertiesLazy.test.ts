import { describe, expect, it } from "vitest";

import { allPropertiesLazy } from "./allPropertiesLazy.js";

describe("allPropertiesLazy", () => {
	it("returns a property directly when it is not a function", async () => {
		const actual = await allPropertiesLazy({ value: "abc" });

		expect(actual).toEqual({ value: "abc" });
	});

	it("returns a property's return directly when it is a function", async () => {
		const actual = await allPropertiesLazy({ value: () => "abc" });

		expect(actual).toEqual({ value: "abc" });
	});

	it("returns a property's resolved result directly when it is a Promise", async () => {
		const actual = await allPropertiesLazy({ value: Promise.resolve("abc") });

		expect(actual).toEqual({ value: "abc" });
	});

	it("returns a property's await return when it is an asynchronous function", async () => {
		const actual = await allPropertiesLazy({
			value: () => Promise.resolve("abc"),
		});

		expect(actual).toEqual({ value: "abc" });
	});

	it("starts tasks immediately when multiple properties are asynchronous functions", async () => {
		let iteration = 0;

		async function returnStartIteration() {
			const current = iteration;
			await Promise.resolve();
			iteration += 1;
			return current;
		}

		const actual = await allPropertiesLazy({
			first: returnStartIteration,
			second: returnStartIteration,
		});

		expect(actual).toEqual({ first: 0, second: 0 });
	});
});
