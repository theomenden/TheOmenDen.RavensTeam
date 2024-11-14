import { Toolbar, ToolbarDivider, ToolbarButton, PresenceBadge, makeStyles, Caption2, Caption1, Divider, tokens } from "@fluentui/react-components";
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
    "flex-direction": "row",
    gap: "10px",
    justifyContent: "space-between",
  }
});

export const TwitchPersona = (props: TwitchPersonaProps) => {
  const twitchUserId = props.twitchUser.id;
  const [streamInfo, { loading, error }] = useQuery(getStreamDetails, twitchUserId);
  const styles = useStyles();
  if (loading) return <PopOverSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.wrapperContent}>
      <div className={styles.personaRow}>
        <Caption1><em>{props.twitchUser.broadcaster_type}</em></Caption1>
        <Divider vertical />
        <Caption2><em>{streamInfo.type === 'live' ? "online" : "offline"}</em></Caption2>
        <PresenceBadge size="medium" status={streamInfo.type === 'live' ? "busy" : "offline"} />
      </div>
      <Toolbar aria-label={`${props.twitchUser}'s social media links`}>
        <div role="gridcell">
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s github`} title={`${props.twitchUser.display_name}'s github`} icon={<FontAwesomeIcon icon={faGithub} />} appearance="primary" target="_blank" rel="noopener"></ToolbarButton>
        </div>
        <ToolbarDivider vertical />
        <div role="gridcell">
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s discord`} title={`${props.twitchUser.display_name}'s discord`} icon={<FontAwesomeIcon icon={faDiscord} />} appearance="primary" target="_blank" rel="noopener"></ToolbarButton>
        </div>
        <ToolbarDivider vertical />
        <div role="gridcell">
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s twitch`} title={`${props.twitchUser.display_name}'s twitch`} icon={<FontAwesomeIcon icon={faTwitch} />} appearance="primary" target="_blank" rel="noopener" href={`https://twitch.tv/${props.twitchUser.login}`}></ToolbarButton>
        </div>
        <ToolbarDivider vertical />
        <div role="gridcell">
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s Twitter/X`} title={`${props.twitchUser.display_name}'s Twitter/X`} icon={<FontAwesomeIcon icon={faXTwitter} />} appearance="primary" target="_blank" rel="noopener"></ToolbarButton>
        </div>
        <ToolbarDivider vertical />
        <div role="gridcell">
          <ToolbarButton as="a" aria-label={`${props.twitchUser.display_name}'s website`} title={`${props.twitchUser.display_name}'s website`} icon={<FontAwesomeIcon icon={faExternalLinkAlt} />} appearance="primary" target="_blank" rel="noopener"></ToolbarButton>
        </div>
      </Toolbar>
    </div>
  );
};
