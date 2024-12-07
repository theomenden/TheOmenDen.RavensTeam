import React, { useState } from "react";
import { TeamResponse } from "../../../utils/twitch-api-types/team-types";
import { useTeamParticipants } from "../../../hooks/team-hooks/use-team-participant-info";
import { Body1, Caption1, Spinner, Title2 } from "@fluentui/react-components";
import { TeamList } from "./team-list";
import { areEqual } from "react-window";

interface TeamPanelsProps {
    teams: TeamResponse[];
}

export const TeamPanels: React.FC<TeamPanelsProps> = ({ teams }: TeamPanelsProps) => {
    const { resolvedTeamMembersbyTeam, loading, error } = useTeamParticipants(teams.map(team => team.id));

    if (loading) return <Spinner appearance="inverted" labelPosition="before" label="Loading team information" />;
    if (error) return <div><Body1 as="h2">An error occured:</Body1><Caption1 as="p">{JSON.stringify(error)}</Caption1></div>

    const teamIds = Object.keys(resolvedTeamMembersbyTeam).forEach(teamId => {
    });
    const teampanels: React.ReactElement[] = [];
     teams.forEach(team => {
       const panel = <div role="tabpanel" aria-labelledby={team.id}>
            <Title2>{team.team_display_name}</Title2>
        </div>;
        teampanels.push(panel);});

return (
    <div>
        {teampanels}
    </div>
);
}