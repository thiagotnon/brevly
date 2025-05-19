import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { getErrorMessage } from "@/lib/get-error-message";
import { Copy } from "@phosphor-icons/react";
import { toast } from "sonner";

export function CopyButton({ shortened }: { shortened: string }) {
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(
        `${env.VITE_FRONTEND_URL}/${shortened}`
      );
      toast.info("Link copiado com sucesso!", {
        richColors: true,
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error), {
        richColors: true,
      });
    }
  }
  return (
    <Button
      variant="secondary"
      size="icon"
      className="enabled:hover:cursor-pointer"
      onClick={handleCopyLink}
    >
      <Copy />
    </Button>
  );
}
