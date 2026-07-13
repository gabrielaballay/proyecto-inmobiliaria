import { useEffect } from "react";
import { branding } from "../config/branding";
import { applyTheme } from "./applyTheme";

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({
    children
}: ThemeProviderProps) {

    useEffect(() => {

        const applyCurrentTheme = () => {

            const isDark =
                document.documentElement.classList.contains("dark");

            applyTheme(
                isDark
                    ? branding.theme.dark
                    : branding.theme.light
            );
        };

        applyCurrentTheme();

        const observer = new MutationObserver(() => {
            applyCurrentTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();

    }, []);

    return <>{children}</>;
}