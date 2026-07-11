import { Toaster } from "sonner";

export default function AppToaster() {
    return (
        <Toaster
            position="top-center"
            richColors
            toastOptions={{
                style: {
                    background: "#fff",
                    color: "#171717",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #e5e5e5",
                    letterSpacing: "0.05em"
                }
            }}
        />
    );
}