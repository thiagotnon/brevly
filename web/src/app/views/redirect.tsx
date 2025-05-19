import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getErrorMessage } from "@/lib/get-error-message";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";
import { toast } from "sonner";
import { useLink } from "../hooks/use-link";

export function Redirect() {
  const params = useParams<{ shortened: string }>();
  const { shortened } = params;
  const queryClient = useQueryClient();

  const { data, isFetching, isSuccess, isError, error } = useLink({
    shortened,
  });

  if (!shortened || isError) {
    toast.error(getErrorMessage(error), {
      richColors: true,
    });
    return <Navigate to="/url/not-found" replace />;
  }

  if (isSuccess && data?.original) {
    queryClient.invalidateQueries({ queryKey: ["links"] });
    window.location.href = data.original;
  }

  return (
    <Card className="relative mt-50 max-w-lg">
      {isFetching && <ProgressBar />}
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <img src="/icon.svg" className="w-12" alt="Página não encontrada" />
        <h1 className="font-bold text-foreground text-xl">Redirecionando...</h1>
        <p className="text-md text-muted-foreground">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado?{" "}
          <a href={data?.original} target="_blank" rel="noreferrer">
            Acesse aqui
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
