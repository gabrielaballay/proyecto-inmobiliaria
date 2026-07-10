import { toast } from "sonner";
import React from "react";

interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loadingText?: string;
    successText?: string;
    errorText?: string;
    onConfirm: () => Promise<void>;
}

export function showConfirmDialog({
    title,
    description,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    loadingText = "Procesando...",
    successText = "Operación realizada correctamente.",
    errorText = "Ocurrió un error.",
    onConfirm
}: ConfirmDialogProps) {

    const overlay = document.createElement("div");

    Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(10,10,10,.20)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "40px",
        zIndex: "999999"
    });

    document.body.appendChild(overlay);

    const close = () => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    };

    toast.custom((t) => (
        <div className="w-[360px] rounded-2xl border border-neutral-200 bg-white shadow-2xl p-5 flex flex-col gap-2 pointer-events-auto">
            <h3 className="text-sm font-black uppercase tracking-wider">
                {title}
            </h3>
            <p className="text-xs text-neutral-500">
                {description}
            </p>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => {
                        toast.dismiss(t);
                        close();
                    }}
                    className="px-4 h-9 rounded-xl border border-neutral-300 text-xs font-bold uppercase"
                >
                    {cancelText}
                </button>
                <button
                    onClick={async () => {
                        toast.dismiss(t);
                        close();
                        const loading = toast.loading(loadingText);
                        try {
                            await onConfirm();
                            toast.success(successText, {
                                id: loading
                            });
                        }
                        catch (error) {
                            console.error(error);
                            toast.error(errorText, {
                                id: loading
                            });
                        }
                    }}
                    className="px-4 h-9 rounded-xl bg-neutral-950 text-white text-xs font-bold uppercase"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    ), {
        duration: Infinity
    });
}