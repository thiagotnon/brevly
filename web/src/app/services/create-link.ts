import { httpClient } from "./http-client";

type CreateLinkParams = {
	original: string;
	shortened: string;
};

type CreateLinkResponse = {
	shortened: string;
};
export async function createLink({
	original,
	shortened,
}: CreateLinkParams): Promise<CreateLinkResponse> {
	const { data } = await httpClient.post("links", { original, shortened });

	return data;
}
