export class LinkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "LinkError";
	}
}
