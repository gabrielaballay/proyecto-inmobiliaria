export type Theme = Record<string, string>;

export function applyTheme(theme: Theme) {

    Object.entries(theme).forEach(([key, value]) => {

        document.documentElement.style.setProperty(
            `--${key}`,
            value
        );

    });

}