import { FluentProvider, makeStyles } from '@fluentui/react-components';
import { useTwitchAuth } from './twitch/useTwitchAuth';
import { fluentThemeFor } from './theme';
import { TeamList } from './components/TeamList';

const useStyles = makeStyles({
  // Fill the iframe box exactly (html/body/#root are pinned to 100% in panel.html), as a flex
  // column so the branded header pins while the roster scrolls. width/height:100% + overflow
  // hidden means the panel never shows its own scrollbars — only MemberList scrolls.
  panel: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
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
