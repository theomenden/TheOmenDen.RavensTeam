using System.Text.Json.Serialization;

namespace RavensTeam.Blazor.Models;

public sealed record TwitchChannels([property: JsonPropertyName("data")] TwitchChannelInfo[] TwitchChannelCollection);

public sealed record TwitchChannelInfo
(
    [property: JsonPropertyName("broadcaster_id")] string BroadcasterId,
    [property: JsonPropertyName("broadcaster_login")] string BroadcasterLogin,
    [property: JsonPropertyName("broadcaster_name")] string BroadcasterName,
    [property: JsonPropertyName("broadcaster_language")] string BroadcasterLanguage,
    [property: JsonPropertyName("game_id")] string GameId,
    [property: JsonPropertyName("game_name")] string GameName,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("delay")] int Delay,
    [property: JsonPropertyName("tags")] string[] Tags,
    [property: JsonPropertyName("content_classification_labels")] string[] ContentClassificationLabels,
    [property: JsonPropertyName("is_branded_content")] bool IsBrandedContent

);
