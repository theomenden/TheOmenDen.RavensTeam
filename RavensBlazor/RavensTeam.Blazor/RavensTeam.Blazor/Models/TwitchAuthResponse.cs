using System.Text.Json.Serialization;

namespace RavensTeam.Blazor.Models;

public sealed record TwitchAuthResponse(
    [property: JsonPropertyName("channelId")] string ChannelId,
    [property: JsonPropertyName("clientId")] string ClientId,
    [property: JsonPropertyName("token")] string AuthToken,
    [property: JsonPropertyName("helixToken")] string HelixAuthToken,
    [property: JsonPropertyName("userId")] string OpaqueUserId);
