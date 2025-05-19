import { httpClient } from "./http-client";

export type GetLinksInput = {
	shortened?: string;
};

export type GetLinkResponse = {
	original: string;
};
export async function getLink({
	shortened,
}: GetLinksInput): Promise<GetLinkResponse> {
	const { data } = await httpClient.get(`links/${shortened}`);

	return data;
}
