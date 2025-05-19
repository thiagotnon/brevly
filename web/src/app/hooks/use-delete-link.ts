import { getErrorMessage } from "@/lib/get-error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { deleteLink } from "../services/delete-link";

export function useDeleteLink() {
  const [isToggle, setIsToggle] = React.useState(false);

  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      setIsToggle(false);
      toast.success("Link removido com sucesso!", {
        richColors: true,
      });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error), {
        richColors: true,
      });
    },
  });

  const handleDeleteLink = async (id: string) => {
    await mutateAsync({ id });
  };

  return {
    handleDeleteLink,
    isPending,
    isToggle,
    setIsToggle,
  };
}
