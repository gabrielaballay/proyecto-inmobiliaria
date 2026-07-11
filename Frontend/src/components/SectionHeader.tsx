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
            <h1 className="text-neutral-900 dark:text-white text-xl font-light tracking-widest uppercase">
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

            <div className="w-12 h-px bg-neutral-900 dark:bg-white mt-4" />
        </div>
    );
}