import react from 'react';
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
    }
});

export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    return (
        <section className={styles.container}>
            <article>
                {children}
            </article>
        </section>
    );
};
