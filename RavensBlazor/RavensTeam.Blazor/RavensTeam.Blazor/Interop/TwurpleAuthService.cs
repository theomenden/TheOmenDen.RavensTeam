using Microsoft.JSInterop;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace RavensTeam.Blazor.Interop;
public interface ITwurpleAuthService
{
    ValueTask CallAuthFunctionAsync();
    ValueTask<string> GetMyUserNameAsync();
}

[SupportedOSPlatform("browser")]
public partial class TwurpleInteropAuthService
{
    [JSImport("callTwitchAuthHelper", "jslib")]
    public static partial void CallAuthFunction();
    [JSImport("getMyUserName", "jslib")]
    public static partial string GetMyUserName();
}

internal sealed class TwurpleAuthService(IJSRuntime jsRuntime, ILogger<TwurpleAuthService> logger)
: ITwurpleAuthService
{
    public ValueTask CallAuthFunctionAsync()
    {
        try
        {
            return jsRuntime.InvokeVoidAsync("jslib.callTwitchAuthHelper");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while calling auth function");
            return ValueTask.CompletedTask;

        }
    }
    public ValueTask<string> GetMyUserNameAsync()
    {
        try
        {
            return jsRuntime.InvokeAsync<string>("jslib.getMyUserName");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while getting username");
            return ValueTask.FromResult(String.Empty);
        }
    }
}
