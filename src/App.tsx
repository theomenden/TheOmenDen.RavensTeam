import { FluentProvider, makeStyles } from '@fluentui/react-components';
import { useTwitchAuth } from './twitch/useTwitchAuth';
import { fluentThemeFor } from './theme';
import { TeamList } from './components/TeamList';

const useStyles = makeStyles({
  // Twitch panels are a fixed 318px wide, up to 496px tall. Fill the panel slot (100vh = the
  // iframe viewport, capped at 496) as a flex column so the tab header can pin while the roster
  // scrolls. overflowX:hidden keeps a long tab/name from ever showing a panel-wide scrollbar.
  panel: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '318px',
    height: '100vh',
    maxHeight: '496px',
    overflow: 'hidden',
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
