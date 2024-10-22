using System.Text.Json;
using Microsoft.JSInterop;
using RavensTeam.Blazor.Models;

namespace RavensTeam.Blazor.Interop;
public interface ITwurpleAuthService
{
    TwitchAuthResponse? GetAuthResponse();
    string GetTwitchConfiguration();
}

internal sealed class TwurpleAuthService(IJSRuntime jsRuntime, ILogger<TwurpleAuthService> logger)
: ITwurpleAuthService
{
    private readonly IJSInProcessRuntime _jsInProcessRuntime = (IJSInProcessRuntime)jsRuntime;

    public TwitchAuthResponse? GetAuthResponse()
    {
        try
        {
            var response = _jsInProcessRuntime.Invoke<string>("jslib.getAuthResponse");
            return JsonSerializer.Deserialize<TwitchAuthResponse>(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while getting auth response");
            return null;
        }
    }

    public string GetTwitchConfiguration()
    {
        try
        {
            var response = _jsInProcessRuntime.Invoke<string>("jslib.getTwitchConfiguration");
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while getting auth response");
            return String.Empty;
        }
    }
}
