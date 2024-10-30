// src/components/TeamListItem.tsx
import React from 'react';
import { Persona } from '@fluentui/react-components';
import type {PersonaProps} from '@fluentui/react-components';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';

interface TeamListItemProps {
    member: TwitchUser;
    style: React.CSSProperties;
    personaProps?: Partial<PersonaProps>;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ member, style, personaProps }) => (
    <div style={style} className="team-member float-in">
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
    </div>
);

export default React.memo(TeamListItem);
