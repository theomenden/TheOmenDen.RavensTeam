using System.Text.Json.Serialization;

namespace RavensTeam.Blazor.Models;

public sealed record TwitchStreamTeams([property: JsonPropertyName("data")] TwitchStreamTeamInfo[] BroadcasterStreamTeams);

public sealed record TwitchStreamTeamInfo
(
    [property: JsonPropertyName("broadcaster_id")] string BroadCasterId,
    [property: JsonPropertyName("broadcaster_name")] string BroadCasterName,
    [property: JsonPropertyName("broadcaster_login")] string BroadCasterLogin,
    [property: JsonPropertyName("background_image_url")] string TeamBackgroundImageUrl,
    [property: JsonPropertyName("banner")] string TeamBannerUrl,
    [property: JsonPropertyName("created_at")] DateTime CreatedAt,
    [property: JsonPropertyName("updated_at")] DateTime UpdatedAt,
    [property: JsonPropertyName("info")] string TeamInformation,
    [property: JsonPropertyName("thumbnail_url")] string TeamLogoThumbnail,
    [property: JsonPropertyName("team_name")] string TeamName,
    [property: JsonPropertyName("team_display_name")] string TeamDisplayName,
    [property: JsonPropertyName("id")] string TeamIdentifier
);
