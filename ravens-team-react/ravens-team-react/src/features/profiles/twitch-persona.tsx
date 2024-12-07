import { Toolbar, ToolbarDivider, ToolbarButton, PresenceBadge, makeStyles, Caption2, Caption1, Divider, tokens, Body1 } from "@fluentui/react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@awesome.me/kit-1d3f5f4627/icons/classic/brands";
import { faDiscord } from "@awesome.me/kit-1d3f5f4627/icons/classic/brands";
import { faTwitch } from "@awesome.me/kit-1d3f5f4627/icons/classic/brands";
import { faXTwitter } from "@awesome.me/kit-1d3f5f4627/icons/classic/brands";
import { faExternalLinkAlt } from "@awesome.me/kit-1d3f5f4627/icons/classic/solid";
import { TwitchUser } from "../../utils/twitch-api-types/user-types";
import { useQuery } from '../../utils/axios-instance';
import { getStreamDetails } from '../../utils/twitchApi';
import { PopOverSkeleton } from "../../components/skeletons/pop-over-skeleton";
import { StreamDataResponse } from "../../utils/twitch-api-types/stream-types";
interface TwitchPersonaProps {
  twitchUser: TwitchUser;
  links: string[];
}

const useStyles = makeStyles({
  wrapperContent: {
    zIndex: tokens.zIndexPopup,
  },
  firstRow: {
    alignItems: "center",
    display: "grid",
    paddingBottom: "10px",
    position: "relative",
    gap: "10px",
    gridTemplateColumns: "min-content 80%",
  },
  secondThirdRow: {
    alignItems: "center",
    display: "grid",
    paddingBottom: "10px",
    position: "relative",
    gap: "10px",
    gridTemplateColumns: "min-content 20% 20% 15% 15%",
  },
  personaRow: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "space-between",
  }
});

export const TwitchPersona = (props: TwitchPersonaProps) => {
  const twitchUserId = props.twitchUser.id;
  const [streamInfo, { loading, error }] = useQuery<StreamDataResponse, string>(getStreamDetails, twitchUserId);
  const styles = useStyles();
  if (loading) return <PopOverSkeleton />;
  if (error) return <div><Body1 as="h2">Error:</Body1><Caption1 as="p">{error.message}</Caption1> </div>;

  return (
    <div className={styles.wrapperContent}>
      <div className={styles.personaRow}>
        <Caption2 as="em">{streamInfo.type === 'live' ? "online" : "offline"}</Caption2>
        <PresenceBadge size="medium" status={streamInfo.type === 'live' ? "busy" : "offline"} />
      </div>
      <Toolbar aria-label={`${props.twitchUser}'s social media links`}>
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s github`} title={`${props.twitchUser.display_name}'s github`} icon={<FontAwesomeIcon icon={faGithub} />} appearance="primary" target="_blank" rel="noopener" />
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s discord`} title={`${props.twitchUser.display_name}'s discord`} icon={<FontAwesomeIcon icon={faDiscord} />} appearance="primary" target="_blank" rel="noopener"/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s twitch`} title={`${props.twitchUser.display_name}'s twitch`} icon={<FontAwesomeIcon icon={faTwitch} />} appearance="primary" target="_blank" rel="noopener" href={`https://twitch.tv/${props.twitchUser.login}`}/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s Twitter/X`} title={`${props.twitchUser.display_name}'s Twitter/X`} icon={<FontAwesomeIcon icon={faXTwitter} />} appearance="primary" target="_blank" rel="noopener"/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s website`} title={`${props.twitchUser.display_name}'s website`} icon={<FontAwesomeIcon icon={faExternalLinkAlt} />} appearance="primary" target="_blank" rel="noopener" />
       </Toolbar>
    </div>
  );
};
