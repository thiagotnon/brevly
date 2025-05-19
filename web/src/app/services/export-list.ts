import { httpClient } from "./http-client";

export async function exportLinks(): Promise<{ reportUrl: string }> {
	const { data } = await httpClient.get("links/exports");
	return data;
}
