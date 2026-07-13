interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export default function PageHeader({
    title,
    subtitle
}: PageHeaderProps) {

    return (
        <div className="mb-10">
            <h1 className="text-app dark:text-white text-xl font-light tracking-widest uppercase">
                {title}
                {subtitle && (
                    <>
                        {" "}
                        <span className="font-semibold">
                            / {subtitle}
                        </span>
                    </>
                )}
            </h1>

            <div className="w-12 h-px btn-primary-theme dark:bg-surface mt-4" />
        </div>
    );
}