import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner, Trash } from "@phosphor-icons/react";
import { Button } from "../../../../../components/ui/button";

type DialogDeleteProps = {
  id: string;
  open: boolean;
  onDelete: (id: string) => Promise<void>;
  isPending: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
};
export function DialogDelete({
  id,
  open,
  onToggle,
  onDelete,
  isPending,
}: DialogDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onToggle}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="enabled:hover:cursor-pointer"
          onClick={() => onToggle((prev) => !prev)}
        >
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button disabled={isPending} variant="secondary" size="sm">
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={async (event) => {
                event.preventDefault();
                await onDelete(id);
                onToggle(false);
              }}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-1">
                  <Spinner className="animate-spin" /> <span>Excluindo</span>
                </span>
              ) : (
                "Confirmar"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
