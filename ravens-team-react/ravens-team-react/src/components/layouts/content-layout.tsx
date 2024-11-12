import { makeStyles, tokens } from '@fluentui/react-components';
import '../../App.css';

const useStyles = makeStyles({
    container: {
        width: '100%',
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusMedium,
        display: 'flex',
        flexDirection: 'column',
        zIndex: tokens.zIndexBackground,
    },
    article: {
        padding: tokens.spacingHorizontalL,
        paddingTop: tokens.spacingVerticalM,
        paddingBottom: tokens.spacingVerticalM
    },
});

export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    return (
        <section className={styles.container}>
            <article className={styles.article}>
                {children}
            </article>
        </section>
    );
};
