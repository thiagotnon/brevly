import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function accessLabel(visits: number) {
	if (visits === 0) return `${visits} acessos`;
	if (visits === 1) return `${visits} acesso`;
	return `${visits} acessos`;
}
