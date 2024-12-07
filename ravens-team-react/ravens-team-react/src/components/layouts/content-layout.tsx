import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
    sectionLayout: {
        width: "100%",
        justifyContent: "stretch",
        alignContent: "center"
    }
});

export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    return (
        <section className={styles.sectionLayout}>
            <article>
                {children}
            </article>
        </section>
    );
};
