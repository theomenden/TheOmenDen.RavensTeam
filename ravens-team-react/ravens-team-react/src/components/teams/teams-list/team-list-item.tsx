// src/components/TeamListItem.tsx
import React, { memo } from 'react';
import { Body1, Button, Caption1, Card, CardFooter, CardHeader, InfoLabel, makeStyles, tokens } from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { ArrowReplyRegular } from '@fluentui/react-icons';
import { TwitchPersona } from '../../../features/profiles/twitch-persona';

interface TeamListItemProps {
  member: TwitchUser;
  listStyles: React.CSSProperties;
}

const useStyles = makeStyles({
  card: {
    margin: "auto",
    maxWidth: "100%",
  },
  listItemStyle: {
    listStyleImage: "none",
    listStyleType: "none",
    padding: "0.5rem",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
  }
});

export const TeamListItem: React.FC<TeamListItemProps> = ({ member }) => {
  const styles = useStyles();
  return (
    <li className={styles.listItemStyle}>
      <Card className={styles.card}>
        <CardHeader
          image={<img width={56} height={56} src={member.profile_image_url} alt={member.display_name} />}
          header={
            <Body1>
              <strong>{member.display_name}</strong>
            </Body1>
          }
          action={<InfoLabel info={<TwitchPersona twitchUser={member} links={[]} />} />}
        />
        <Caption1>{member.description}</Caption1>
        <CardFooter>
          <Button icon={<ArrowReplyRegular fontSize={16} />}>Follow</Button>
        </CardFooter>
      </Card>
    </li>
  );
}