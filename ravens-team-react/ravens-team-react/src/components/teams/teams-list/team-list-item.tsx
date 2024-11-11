// src/components/TeamListItem.tsx
import React, { memo } from 'react';
import { Body1, Button, Caption1, Card, CardFooter, CardHeader, InfoLabel, makeStyles } from '@fluentui/react-components';
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
});

export const TeamListItem: React.FC<TeamListItemProps> = ({ member, listStyles }) => {
  const styles = useStyles();
  console.log(listStyles);
  return (
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
  );
}