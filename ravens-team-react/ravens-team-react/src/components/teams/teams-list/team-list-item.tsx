// src/components/TeamListItem.tsx
import React from 'react';
import { Body1Strong, Button, buttonClassNames, Caption1, Card, CardFooter, CardHeader, CardPreview, Image, InfoLabel, makeResetStyles, makeStyles, mergeClasses, Spinner, tokens } from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { ArrowReplyRegular } from '@fluentui/react-icons';
import { TwitchPersona } from '../../../features/profiles/twitch-persona';
import { ListItem } from '@fluentui/react-list-preview';

interface TeamListItemProps {
  member: TwitchUser;
}

const useStyles = makeStyles({
  listItem: {
    display: "grid",
    gap: "0.5em",
    width: "100%",
    boxShadow: tokens.shadow8Brand,
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalMNudge
  },
  image: {
    height: '64px',
    width: '64px',
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

const renderPersonaDetails = (user: TwitchUser) => 
   <InfoLabel id={`btn-${user.id}`} onClick={e => e.preventDefault()} info={<TwitchPersona twitchUser={user} links={[]} />} />;

export const TeamListItem: React.FC<TeamListItemProps> = ({ member }: TeamListItemProps) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [followedChannel, setFollowedChannel] = React.useState<boolean>(false);
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
  };

  return (
    <Card appearance='filled-alternative'
      className={styles.listItem}
      checkbox={null}>
      <CardHeader
        header={<Body1Strong as="strong" className={styles.title}>{member.display_name}</Body1Strong>}
        image={
          {
            as: "img",
            src: member.profile_image_url,
            alt: `${member.display_name} logo`,
            height: '64',
            width: '64',
            loading: 'lazy',
            className: styles.image,
          }
        }
        description={<Caption1 as="p" className={styles.caption}>{member.broadcaster_type}</Caption1>}
        action={renderPersonaDetails(member)}
      />
      <Caption1 as="p" className={styles.caption}>{member.description}</Caption1>
      <CardFooter>
        <Button
          id={`btn-follow-${member.id}`}
          className={buttonClassName}
          iconPosition='before'
          icon={determineButtonIcon}
          onClick={followMember}
          appearance='primary'>
          Follow
        </Button>
      </CardFooter>
    </Card>
  );
}