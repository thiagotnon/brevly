import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export function NotFound() {
  return (
    <Card className="mt-50 max-w-lg">
      <CardContent className="flex flex-col items-center gap-8 text-center">
        <img src="/404.svg" className="w-48" alt="Página não encontrada" />
        <h1 className="font-bold text-foreground text-xl">
          Link não encontrado
        </h1>
        <p className="text-md text-muted-foreground">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em <Link to="/">brev.ly</Link>.
        </p>
      </CardContent>
    </Card>
  );
}
