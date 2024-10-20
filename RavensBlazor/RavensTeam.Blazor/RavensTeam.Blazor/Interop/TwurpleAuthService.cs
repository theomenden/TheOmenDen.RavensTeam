using Microsoft.JSInterop;

namespace RavensTeam.Blazor.Interop;
public interface ITwurpleAuthService
{
    ValueTask<string> GetMyUserNameAsync();
}
internal sealed class TwurpleAuthService(IJSRuntime jsRuntime, ILogger<TwurpleAuthService> logger)
: ITwurpleAuthService
{
    private readonly IJSRuntime _jsRuntime = jsRuntime;
    private readonly ILogger<TwurpleAuthService> _logger = logger;

    public ValueTask<string> GetMyUserNameAsync()
    {
        try
        {
            return _jsRuntime.InvokeAsync<string>("jslib.getMyUserName");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while getting username");
            return ValueTask.FromResult(String.Empty);
        }
    }
}
