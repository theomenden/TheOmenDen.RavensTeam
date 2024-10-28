// src/components/TeamList.tsx
import React from 'react';
import { Divider, Persona, SelectionItemId, TabList, Tab, Text, makeStyles } from '@fluentui/react-components';
import type { PersonaProps } from '@fluentui/react-components';
import { useTeamData } from '../../../hooks/team-hooks/use-team-data';
import '../../../styles/TeamList.scss';
import { SkeletonPersona } from '../../skeletons/skeleton-persona';

interface TeamListProps {
    broadcasterId: string;
    accessToken: string;
}

const useStyles = makeStyles({
    root: {
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: "50px 20px",
      rowGap: "20px",
    },
  });

export const TeamList: React.FC<TeamListProps> = ({ broadcasterId, accessToken }) => {
    const { teamMembersByTeam, loading, error } = useTeamData({ broadcasterId, accessToken });
    const tabClasses = useStyles();
    if (loading) {
        return (
            <div className="team-grid">
                <SkeletonPersona />
                <SkeletonPersona />
                <SkeletonPersona />
            </div>
        );
    }

    if (error) return <Text>{error}</Text>;

    return (
        <div className="team-list">
            {Object.entries(teamMembersByTeam).length > 0 ? (
                Object.entries(teamMembersByTeam).map(([teamName, members], teamIndex) => (
                    <div key={teamIndex} className="team-section">
                        <TabList {...tabClasses} size='small' vertical>                        
                            <Tab value={teamName} >{teamName} - Members: {members.length}</Tab>
                        </TabList>
                    </div>
                ))
            ) : (
                <Text>No team members found.</Text>
            )}
        </div>
    );
};