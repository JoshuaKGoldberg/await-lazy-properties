export type AwaitedLazyProperties<T> = {
	[K in keyof T]: AwaitedLazyProperty<T[K]>;
};

export type AwaitedLazyProperty<T> = T extends () => infer R ? Awaited<R> : T;
