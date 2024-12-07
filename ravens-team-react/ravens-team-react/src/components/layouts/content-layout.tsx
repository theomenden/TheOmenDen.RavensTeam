import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
    sectionLayout: {
        width: "100%",
        justifyContent: "stretch",
        alignContent: "center"
    },
    articleLayout: {
        display: "grid",
        gridAutoFlow: "row",
        gap: "1em",
        justifyContent: "around",
        width: "100%",
    }
});

export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    return (
        <section className={styles.sectionLayout}>
            <article className={styles.articleLayout}>
                {children}
            </article>
        </section>
    );
};
