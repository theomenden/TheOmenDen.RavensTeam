using Blazored.LocalStorage;
using RavensTeam.Blazor.Models;
using System.Text.Json;
using Microsoft.JSInterop;

namespace RavensTeam.Blazor.Interop;

public interface IHelixService
{
    TwitchAuthResponse? RetrieveTwitchAuthResponse();
    TwitchChannelInfo GetChannelInfo(string? broadcasterId);
    TwitchStreamTeamInfo[] GetStreamTeamInfo(string? channelId);
}

internal sealed class HelixService(IHttpClientFactory clientFactory, IJSRuntime jsRuntime, ILogger<HelixService> logger, ISyncLocalStorageService localStorageService)
: IHelixService
{
    private readonly IJSInProcessRuntime _jsInProcessRuntime = (IJSInProcessRuntime)jsRuntime;

    public TwitchAuthResponse? RetrieveTwitchAuthResponse()
    {
        try
        {
            var response = _jsInProcessRuntime.Invoke<string>("jslib.getAuthResponse");
            var authResponse = JsonSerializer.Deserialize<TwitchAuthResponse>(response, JsonSerializerOptions.Default);
            localStorageService.SetItemAsString("broadcasterId", authResponse.ChannelId);
            return authResponse;
        }
        catch (JSException ex)
        {
            logger.LogError(ex, "Error while deserializing auth response: {Ex}", ex.Data);
            return null;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while getting auth response");
            return null;
        }
    }

    public TwitchChannelInfo GetChannelInfo(string? broadcasterId)
    {
        broadcasterId ??= localStorageService.GetItemAsString("broadcasterId");
        var response = _jsInProcessRuntime.Invoke<TwitchChannelInfo[]>("jslib.getChannelInfo", broadcasterId);

        return response[0];
    }

    public TwitchStreamTeamInfo[] GetStreamTeamInfo(string? teamId)
    {
        teamId ??= localStorageService.GetItemAsString("teamId");
        var response = _jsInProcessRuntime.Invoke<TwitchStreamTeamInfo[]>("jslib.getStreamTeamInfo", teamId);

        return response;
    }
}
