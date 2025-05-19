import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportLinks } from "../services/export-list";
import { getLinks, type GetLinksResponse } from "../services/get-links";

type UseInfiniteLinksParams = {
  searchQuery?: string;
  sortBy?: "createdAt";
  sortDirection?: "asc" | "desc";
  pageSize?: string;
};

export function useLinks(params?: Partial<UseInfiniteLinksParams>) {
  const {
    data,
    isFetching,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<GetLinksResponse, Error>({
    queryKey: ["links", params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return getLinks({
        ...params,
        page: String(pageParam),
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (acc, page) => acc + page.links.length,
        0
      );

      if (totalLoaded >= lastPage.total) {
        return undefined;
      }

      return allPages.length + 1;
    },
    refetchOnWindowFocus: true,
  });

  const { isPending: isPendingExport, mutateAsync } = useMutation({
    mutationKey: ["export-links"],
    mutationFn: exportLinks,
    onSuccess: (data) => {
      window.open(data.reportUrl);
      toast.success("CSV gerado com sucesso!",{
				richColors: true,
			});
    },
    onError: () => {
      toast.error("Erro ao gerar CSV", {
        richColors: true,
      });
    },
  });

  async function handleExportLinks() {
    await mutateAsync();
  }

  return {
    data,
    isFetching,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    handleExportLinks,
    isPendingExport,
  };
}
