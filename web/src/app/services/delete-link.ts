import { httpClient } from "./http-client";

export type GetLinksInput = {
	id: string;
};

export async function deleteLink({ id }: GetLinksInput) {
	const { data } = await httpClient.delete(`links/${id}`);

	return data;
}
