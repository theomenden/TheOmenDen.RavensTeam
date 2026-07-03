import { FluentProvider, makeStyles } from '@fluentui/react-components';
import { useTwitchAuth } from './twitch/useTwitchAuth';
import { fluentThemeFor } from './theme';
import { TeamList } from './components/TeamList';

const useStyles = makeStyles({
  // Twitch panels are a fixed 318px wide, up to 496px tall.
  panel: {
    boxSizing: 'border-box',
    width: '318px',
    maxHeight: '496px',
    overflowY: 'auto',
    paddingBlock: '8px',
    paddingInline: '8px',
  },
});

/** Root component: syncs the Twitch theme + auth into a Fluent-themed, panel-sized surface. */
export const App = () => {
  const { auth, theme } = useTwitchAuth();
  const styles = useStyles();
  return (
    <FluentProvider theme={fluentThemeFor(theme)} className={styles.panel}>
      <TeamList auth={auth} />
    </FluentProvider>
  );
};
