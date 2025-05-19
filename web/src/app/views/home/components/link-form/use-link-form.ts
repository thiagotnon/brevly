import { createLink } from "@/app/services/create-link";
import { getErrorMessage } from "@/lib/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

const schema = z.object({
	original: z
		.string()
		.url({ message: "URL inválida" })
		.refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
			message: "A URL deve começar com http:// ou https://",
		}),
	shortened: z
		.string()
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Apenas letras, números, hífen e underline são permitidos",
		)
		.nonempty("Informe uma url minúsula e sem espaço/caracter especial."),
});

type FormData = z.infer<typeof schema>;
export function useLinkForm() {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	const { handleSubmit: hookFormHandleSubmit } = form;

	const queryClient = useQueryClient();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: createLink,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["links"] });
			toast.success("Link criado com sucesso!", {
				richColors: true,
			});
			form.reset();
		},
		onError: (error: unknown) => {
			toast.error(getErrorMessage(error), {
				richColors: true,
			});
		},
	});

	const handleSubmit = hookFormHandleSubmit(async (data) => {
		await mutateAsync(data);
	});

	return {
		form,
		handleSubmit,
		isPending,
	};
}
