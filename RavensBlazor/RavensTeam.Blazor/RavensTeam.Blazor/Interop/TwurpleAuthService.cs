using Microsoft.JSInterop;

namespace RavensTeam.Blazor.Interop;
public interface ITwurpleAuthService
{
    ValueTask CallAuthFunctionAsync();
    ValueTask<string> GetMyUserNameAsync();
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
