export function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), ms);
	});
}
