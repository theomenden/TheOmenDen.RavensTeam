import { useEffect } from 'react';
import { FluentProvider, makeStyles, tokens } from '@fluentui/react-components';
import { useTwitchAuth } from './twitch/useTwitchAuth';
import { buildTheme } from './theme';
import { useEffectiveSettings } from './settings/useEffectiveSettings';
import { ViewerSettings } from './settings/ViewerSettings';
import { TeamList } from './components/TeamList';

const useStyles = makeStyles({
  // Fill the iframe box exactly (html/body/#root are pinned to 100% in panel.html), as a flex
  // column so the branded header pins while the roster scrolls. width/height:100% + overflow
  // hidden means the panel never shows its own scrollbars — only MemberList scrolls. position
  // relative anchors the ViewerSettings drawer, which overlays the roster (no portal).
  panel: {
    boxSizing: 'border-box',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    maxHeight: '496px',
    overflow: 'hidden',
    // PanelHeader cancels these two tokens with matching negative margins to go full-bleed; keep
    // them tokens on both sides so density scaling moves the padding and the bar together.
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalS,
  },
});

/** Root component: syncs Twitch auth + settings into a Fluent-themed, panel-sized surface. */
export const App = () => {
  const { auth, theme } = useTwitchAuth();
  const { settings, setOverride, reset } = useEffectiveSettings();
  const styles = useStyles();

  // Drive the reduced-motion global reset (defined in panel.html) off the effective setting.
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion);
  }, [settings.reducedMotion]);

  return (
    <FluentProvider theme={buildTheme(settings, theme)} className={styles.panel}>
      <ViewerSettings settings={settings} setOverride={setOverride} reset={reset} />
      <TeamList auth={auth} />
    </FluentProvider>
  );
};
