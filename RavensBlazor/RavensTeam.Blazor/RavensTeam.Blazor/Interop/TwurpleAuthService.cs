using Microsoft.JSInterop;

namespace RavensTeam.Blazor.Interop;
public interface ITwurpleAuthService
{
    void CallAuthFunction();
    ValueTask<string> GetMyUserNameAsync();
}

internal sealed class TwurpleAuthService(IJSRuntime jsRuntime, ILogger<TwurpleAuthService> logger)
: ITwurpleAuthService
{
    private readonly IJSInProcessRuntime _jsInProcessRuntime = (IJSInProcessRuntime)jsRuntime;
    public void CallAuthFunction()
    {
        try
        {
            _jsInProcessRuntime.InvokeVoid("jslib.callTwitchAuthHelper");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while calling auth function");
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
