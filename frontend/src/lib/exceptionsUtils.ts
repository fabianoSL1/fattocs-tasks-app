import { ClientException } from "@/exceptions/ClientException";
import { ServerException } from "@/exceptions/ServerException";
import { toast } from "@/hooks/use-toast";

export function handlerExceptions(err: unknown, title: string) {
	const params: Record<string, string> = { title };
	if (err instanceof ClientException) {
		params.description = err.message;
	}

	if (err instanceof ServerException) {
		params.description = "Desculpe estamos com problemas";
		params.variant = "destructive";
	}

	toast(params);
}
