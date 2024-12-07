import React, { useState } from "react";
import { TeamResponse } from "../../../utils/twitch-api-types/team-types";
import { useTeamParticipants } from "../../../hooks/team-hooks/use-team-participant-info";
import { Body1, Caption1, Spinner, Title2 } from "@fluentui/react-components";
import { TeamList } from "./team-list";
import { ContentLayout } from "../../layouts/content-layout";

interface TeamPanelsProps {
    currentTeamId: string | null,
    teams: TeamResponse[];
}



export const TeamPanels: React.FC<TeamPanelsProps> = ({ currentTeamId ,teams }: TeamPanelsProps) => {
    const { resolvedTeamMembersbyTeam, loading, error } = useTeamParticipants(teams);
    
    if (loading) return <Spinner appearance="inverted" labelPosition="before" label="Loading team information" />;
    if (error) return <div><Body1 as="h2">An error occured:</Body1><Caption1 as="p">{JSON.stringify(error)}</Caption1></div>

    // If the currentTeamId is null, return an empty div
    if (!currentTeamId) return <div></div>;

    // Check if the currentTeamId is in the resolvedTeamMembersbyTeam object
    const teamMembers = resolvedTeamMembersbyTeam[currentTeamId];

    // Memoize the TeamList component to prevent unnecessary re-renders
    const TeamListMemo = React.memo(TeamList);

    // Create a memoized array of TeamList components for each team
    const teamListComponents = teams.map(team => (
        <div key={team.id} role="tabpanel" aria-labelledby={team.id}>
            <TeamListMemo key={team.id} members={resolvedTeamMembersbyTeam[team.id]} />
        </div>
    ));



return (
    <ContentLayout>
        {teamListComponents.filter(tc => tc.key === currentTeamId)}
    </ContentLayout>
);
}