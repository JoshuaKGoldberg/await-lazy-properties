import { withoutUndefinedProperties } from "without-undefined-properties";

import { AwaitedLazyProperties } from "./types.js";

export async function allPropertiesLazy<T extends object>(
	source: T,
): Promise<AwaitedLazyProperties<T>> {
	const result: Record<string, unknown> = {};
	const tasks: Promise<void>[] = [];

	for (const [key, creator] of Object.entries(source)) {
		if (creator instanceof Promise) {
			tasks.push(
				creator.then((awaited) => {
					result[key] = awaited;
				}),
			);
		}

		if (!isFunction(creator)) {
			result[key] = creator;
			continue;
		}

		const task = creator();

		if (task instanceof Promise) {
			tasks.push(
				task.then((awaited) => {
					result[key] = awaited;
				}),
			);
		} else if (task !== undefined) {
			result[key] = task;
		}
	}

	await Promise.all(tasks);

	return withoutUndefinedProperties(result) as AwaitedLazyProperties<T>;
}

/**
 * This is technically not correct, as `creator` could be a class constructor.
 * There's no good way to detect that though.
 */
function isFunction(creator: unknown): creator is () => unknown {
	return typeof creator === "function";
}
