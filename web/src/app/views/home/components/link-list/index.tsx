import { useLinks } from "@/app/hooks/use-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DownloadSimple, Link, Spinner } from "@phosphor-icons/react";
import React from "react";
import { LinkListItem } from "./link-list-item";

export function LinkList() {
  const {
    data,
    isFetching,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    handleExportLinks,
    isPendingExport,
  } = useLinks({});

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const observerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = observerRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);
  const links = data?.pages?.flatMap((page) => page.links) ?? [];

  const isDisabledDownloadButton = data?.pages[0]?.total;

  return (
    <Card className="relative flex flex-col gap-0 border">
      {isFetching && <ProgressBar />}

      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <CardTitle className="font-bold text-lg">Meus links</CardTitle>
        <Button
          size="sm"
          variant="secondary"
          className="enabled:hover:cursor-pointer"
          disabled={!isDisabledDownloadButton || isPendingExport}
          onClick={handleExportLinks}
        >
          {isPendingExport ? (
            <Spinner className="animate-spin" />
          ) : (
            <DownloadSimple />
          )}
          Baixar CSV
        </Button>
      </CardHeader>
      <CardContent ref={scrollRef} className="flex-1">
        <ScrollArea className="border-t border-border max-h-[calc(100dvh-34rem)] lg:max-h-[calc(100dvh-20rem)] overflow-y-scroll">
          {links?.length > 0 &&
            links?.map((link) => (
              <LinkListItem
                key={link.id}
                id={link.id}
                original={link.original}
                shortened={link.shortened}
                visits={link.visits}
              />
            ))}
          <ScrollBar className="bg-amber-300" />
        </ScrollArea>
        <div ref={observerRef} />
        {(isLoading || isFetchingNextPage) && <LoadingLinks />}
        {links?.length === 0 && !isFetching && <EmptyList />}
      </CardContent>
    </Card>
  );
}

function LoadingLinks() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <Spinner size={32} className="text-muted-foreground animate-spin" />
      <span className="inline-block text-muted-foreground text-xs uppercase">
        Carregando
      </span>
    </div>
  );
}

function EmptyList() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <Link size={32} className="text-muted-foreground" />
      <span className="inline-block text-muted-foreground text-xs uppercase">
        Ainda não existem links cadastrados
      </span>
    </div>
  );
}
