import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
	if (isAxiosError(error)) {
		return (
			error.response?.data?.message ||
			error.response?.data?.error ||
			"Erro desconhecido do servidor."
		);
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Erro inesperado.";
}
