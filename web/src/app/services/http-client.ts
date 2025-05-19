import { env } from "@/env";
import axios from "axios";

export const httpClient = axios.create({
	baseURL: env.VITE_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});
