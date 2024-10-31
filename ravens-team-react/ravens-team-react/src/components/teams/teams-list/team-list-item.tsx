// src/components/TeamListItem.tsx
import React from 'react';
import { Persona } from '@fluentui/react-components';
import type {PersonaProps} from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';

interface TeamListItemProps {
    member: TwitchUser;
    personaProps?: Partial<PersonaProps>;
}

export const TeamListItem: React.FC<TeamListItemProps> = ({ member, personaProps }) => (
        <Persona
            primaryText={member.display_name || member.login || 'Unknown User'  }
            secondaryText={member.type || 'Team Member'}
            avatar={{
                image: {
                  src: member.profile_image_url,
                },
              }}
            className="persona-item"
            {...personaProps}
        />
);