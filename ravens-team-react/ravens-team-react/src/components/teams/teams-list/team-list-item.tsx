// src/components/TeamListItem.tsx
import React from 'react';
import { Body1, Button, Caption1, Card, CardFooter, CardHeader, InfoLabel, makeStyles, tokens } from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { ArrowReplyRegular } from '@fluentui/react-icons';
import { TwitchPersona } from '../../../features/profiles/twitch-persona';

interface TeamListItemProps {
  member: TwitchUser;
}

const useStyles = makeStyles({
  card: {
    width: "100%",
    listStyleImage: "none",
    listStyleType: "none",
    padding: "1.5em",
    justifyContent: "space-evenly",
    gap: "1em",
  }
});

export const TeamListItem: React.FC<TeamListItemProps> = ({ member }) => {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <CardHeader
        image={<img width={56} height={56} src={member.profile_image_url} alt={member.display_name} />}
        header={
          <Body1>
            <strong>{member.display_name}</strong>
          </Body1>
        }
        action={<div role="gridcell" ><InfoLabel id={`btn-${member.id}`} onClick={e=> e.preventDefault()} info={<TwitchPersona twitchUser={member} links={[]} />} weight='semibold' /></div>}
      />
      <Caption1>{member.description}</Caption1>
      <CardFooter>
      <div role="gridcell" ><Button icon={<ArrowReplyRegular fontSize={16} />}>Follow</Button></div>
      </CardFooter>
    </Card>
  );
}