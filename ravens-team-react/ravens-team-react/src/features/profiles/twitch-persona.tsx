import { Toolbar, ToolbarDivider, ToolbarButton, PresenceBadge, makeStyles, Caption2, Caption1, Divider, tokens, Body1, PresenceBadgeStatus } from "@fluentui/react-components";
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
import React from "react";
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
    justifyContent: "space-between",
  }
});

const hasStreamerDetails = (streamInfo: StreamDataResponse) => {
  return streamInfo && streamInfo[0];
}

export const TwitchPersona = (props: TwitchPersonaProps) => {
  console.info(`TwitchPersona for:`, props.twitchUser);
  const twitchUserId = props.twitchUser.id;
  const [streamInfo, { loading, error }] = useQuery<StreamDataResponse, string>(getStreamDetails, twitchUserId);
  const styles = useStyles();
  if (loading) return <PopOverSkeleton />;
  if (error) return <div><Body1 as="h2">Error:</Body1><Caption1 as="p">{error.message}</Caption1> </div>;

  // if the user has a live stream, display additional details
  const displayName = props.twitchUser.display_name;
  const liveStatus = (hasStreamerDetails(streamInfo as StreamDataResponse) && streamInfo[0].type == 'live'? "online" : "offline");
  const presenceBadgeStatus = (hasStreamerDetails(streamInfo as StreamDataResponse) && streamInfo[0].type == 'live'? "busy" : "offline");
  
  return (
    <div className={styles.wrapperContent}>
      <div className={styles.personaRow}>
        <Caption2 as="em">{liveStatus}</Caption2>
        <PresenceBadge size="medium" status={presenceBadgeStatus} />
      </div>
      <Toolbar aria-label={`${props.twitchUser}'s social media links`}>
          <ToolbarButton as="a" aria-label={`${displayName}'s github`} title={`${displayName}'s github`} icon={<FontAwesomeIcon icon={faGithub} />} appearance="primary" target="_blank" rel="noopener" />
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${displayName}'s discord`} title={`${displayName}'s discord`} icon={<FontAwesomeIcon icon={faDiscord} />} appearance="primary" target="_blank" rel="noopener"/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${displayName}'s twitch`} title={`${displayName}'s twitch`} icon={<FontAwesomeIcon icon={faTwitch} />} appearance="primary" target="_blank" rel="noopener" href={`https://twitch.tv/${props.twitchUser.login}`}/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${displayName}'s Twitter/X`} title={`${displayName}'s Twitter/X`} icon={<FontAwesomeIcon icon={faXTwitter} />} appearance="primary" target="_blank" rel="noopener"/>
        <ToolbarDivider vertical />
          <ToolbarButton as="a" aria-label={`${displayName}'s website`} title={`${displayName}'s website`} icon={<FontAwesomeIcon icon={faExternalLinkAlt} />} appearance="primary" target="_blank" rel="noopener" />
       </Toolbar>
    </div>
  );
};
