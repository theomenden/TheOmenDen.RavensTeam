export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    return (
        <section>
            <article>
                {children}
            </article>
        </section>
    );
};
