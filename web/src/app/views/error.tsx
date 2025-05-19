import { Card, CardContent } from "@/components/ui/card";
import { LinkBreak } from "@phosphor-icons/react";
import { Link } from "react-router";

export function ErrorElement() {
  return (
    <Card className="mt-50 max-w-lg">
      <CardContent className="flex flex-col items-center gap-8 text-center">
        <LinkBreak size={90} className="text-primary" weight="duotone" />
        <h1 className="font-bold text-foreground text-xl">
          Ocorreu um erro inesperado.
        </h1>
        <p className="text-md text-muted-foreground">
          Não conseguimos finalizar a sua solicitação. Isso pode ter acontecido
          por conta de um erro no servidor ou uma URL inválida. Acesse{" "}
          <Link to="/">brev.ly</Link>.
        </p>
      </CardContent>
    </Card>
  );
}
