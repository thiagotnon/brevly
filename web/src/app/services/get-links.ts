import { httpClient } from "./http-client";

export type GetLinksInput = {
	searchQuery: string;
	sortBy: "createdAt";
	sortDirection: "asc" | "desc";
	page: string;
	pageSize: string;
};

export type GetLinksResponse = {
	links: Array<{
		id: string;
		original: string;
		shortened: string;
		createdAt: Date;
		visits: number;
	}>;
	total: number;
};
export async function getLinks({
	page,
	pageSize,
	searchQuery,
	sortBy,
	sortDirection,
}: Partial<GetLinksInput>): Promise<GetLinksResponse> {
	const { data } = await httpClient.get("links", {
		params: {
			page,
			pageSize,
			searchQuery,
			sortBy,
			sortDirection,
		},
	});

	return data;
}
