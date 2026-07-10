import axios from "axios";
import { toast } from "sonner";

export function showApiError(error: unknown) {

    if (!axios.isAxiosError(error)) {

        toast.error("Error inesperado.");
        return;
    }

    const data = error.response?.data;

    if (data?.errors) {

        data.errors.forEach((item: any) =>
            toast.error("Error: " + item.message, {
                style: {
                    border: "1px solid #ef4444",
                    borderLeft: "4px solid #ef4444",
                    borderRadius: "6px"
                }
            })
        );

        return;
    }

    toast.error(
        data?.message ??
        "Ocurrió un error inesperado."
    );

}