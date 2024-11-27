// src/components/TeamListItem.tsx
import React from 'react';
import { Body1Strong, Button, buttonClassNames, Caption1, Image, InfoLabel, makeResetStyles, makeStyles, mergeClasses, Spinner, tokens } from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { ArrowReplyRegular } from '@fluentui/react-icons';
import { TwitchPersona } from '../../../features/profiles/twitch-persona';
import { ListItem } from '@fluentui/react-list-preview';

interface TeamListItemProps {
  member: TwitchUser;
}
const useListItemRootStyles = makeResetStyles({
  position: "relative",
  flexGrow: "1",
  gap: "0.5em",
  alignItems: "center",
  borderRadius: "8px",
  gridTemplate: `"preview preview preview" auto
      "header action secondary_action" auto / 1fr auto auto
    `,
});
const useStyles = makeStyles({
  listItem: {
    display: "grid",
    gap: "0.5em",
    boxShadow: tokens.shadow4Brand,
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalMNudge
  },
  image: {
    height: '48px',
    width: '48px',
    maxWidth: "100%",
    borderRadius: "5px",
  },
  title: {
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
    display: "block",
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  preview: { gridArea: "preview", overflow: "hidden" },
  header: { gridArea: "header" },
  action: { gridArea: "action" },
  secondaryAction: { gridArea: "secondary_action" },
  buttonNonInteractive: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground1,
    cursor: "default",
    pointerEvents: "none",

    [`& .${buttonClassNames.icon}`]: {
      color: tokens.colorStatusSuccessForeground1,
    },
  }
});



export const TeamListItem: React.FC<TeamListItemProps> = ({ member }) => {
  const [loading, setLoading] = React.useState(false);
  const [followedChannel, setFollowedChannel] = React.useState(false);
  const listItemStyles = useListItemRootStyles();
  const styles = useStyles();

  const determineButtonIcon = loading ? <Spinner size="tiny" /> : <ArrowReplyRegular fontSize={16} />;
  const didTheyFollow = (didFollow: boolean, channelName: string) => {
    if (didFollow) {
      setFollowedChannel(true);
    }
    setLoading(false);
  };
  const buttonClassName = !loading || followedChannel ? undefined : styles.buttonNonInteractive;
  const followMember = (e: React.MouseEvent) => {
    setLoading(true);
    e.preventDefault();
    window.Twitch.ext.actions.onFollow(didTheyFollow);
    window.Twitch.ext.actions.followChannel(member.login);
  }
  return (
    <ListItem
      value={member.display_name}
      className={mergeClasses(listItemStyles, styles.listItem)}
      aria-label={member.display_name}>
      <div role="gridcell" className={styles.preview}>
        <Image fit="cover" height={48} width={48} className={styles.image} src={member.profile_image_url} alt={member.display_name} />
      </div>
      <div role="gridcell" className={styles.header}>
        <Body1Strong as="strong" className={styles.title}>{member.display_name}</Body1Strong>
        <Caption1 as="p" className={styles.caption}>{member.description}</Caption1>
      </div>
      <div role="gridcell" className={styles.action}>
        <Button id={`btn-follow-${member.id}`} className={buttonClassName} iconPosition='before' icon={determineButtonIcon} onClick={followMember} appearance='primary'>Follow</Button>
      </div>
      <div role="gridcell" className={styles.secondaryAction}>
        <InfoLabel id={`btn-${member.id}`} onClick={e => e.preventDefault()} info={<TwitchPersona twitchUser={member} links={[]} />} weight='semibold' />
      </div>
    </ListItem>
  );
}