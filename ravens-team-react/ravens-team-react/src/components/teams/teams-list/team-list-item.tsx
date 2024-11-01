// src/components/TeamListItem.tsx
import React from 'react';
import { Body1, Body2, Button, Caption1, Caption2, Card, CardFooter, CardHeader, CardPreview, InfoLabel, makeStyles, Persona } from '@fluentui/react-components';
import type { PersonaProps } from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { AppsListDetailRegular, ArrowReplyRegular, CheckmarkStarburstRegular, MegaphoneCircleRegular } from '@fluentui/react-icons';

interface TeamListItemProps {
  member: TwitchUser;
  personaProps?: Partial<PersonaProps>;
}

const useStyles = makeStyles({
  card: {
    margin: "auto",
    maxWidth: "100%",
  },
});

export const TeamListItem: React.FC<TeamListItemProps> = ({ member, personaProps }) => {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <CardHeader
        image={
          <img width={56} height={56} src={member.profile_image_url} alt={member.display_name} />
        }
        header={
          <Body1>
            <strong>{member.display_name}</strong>
          </Body1>
        }
        description={<Caption1><em>{member.broadcaster_type}</em></Caption1>}
        action={
          <InfoLabel
          info={
            <>
              <Body2>{member.created_at}</Body2>
            </>
          }></InfoLabel>
      }
      />
      <Caption2>
        {
          member.broadcaster_type === 'partner' ? <CheckmarkStarburstRegular fontSize={20} /> :
            member.broadcaster_type === 'affiliate' ? <MegaphoneCircleRegular fontSize={20} /> : undefined
        }
      </Caption2>
      <Caption1>{member.description}</Caption1>
      <CardFooter>
        <Button icon={<ArrowReplyRegular fontSize={16} />}>Follow</Button>
      </CardFooter>
    </Card>
  );
}