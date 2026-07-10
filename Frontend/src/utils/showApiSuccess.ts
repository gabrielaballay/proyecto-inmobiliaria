import axios from "axios";
import { toast } from "sonner";

export function showApiSucces(message: string) {

    toast.error(message, {
        style: {
            border: "1px solid #22c55e",
            borderLeft: "4px solid #22c55e",
            borderRadius: "6px"
        }
    })
}