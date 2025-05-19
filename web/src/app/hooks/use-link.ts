import { useQuery } from "@tanstack/react-query";
import { getLink, type GetLinkResponse } from "../services/get-link";

type UseLinkParams = {
	shortened?: string;
};

export function useLink({ shortened }: UseLinkParams) {
	return useQuery<GetLinkResponse, Error>({
		queryKey: ["link", shortened],
		queryFn: () => getLink({ shortened }),
	});
}
