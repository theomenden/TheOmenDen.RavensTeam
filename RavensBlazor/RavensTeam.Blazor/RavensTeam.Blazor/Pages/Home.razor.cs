using Microsoft.AspNetCore.Components;
using Microsoft.FluentUI.AspNetCore.Components;
using RavensTeam.Blazor.Interop;

namespace RavensTeam.Blazor.Pages;

public partial class Home : ComponentBase
{
    [Inject] private ITwurpleAuthService TwurpleAuthService { get; init; } = default!;
    private readonly List<string> _streamerNames = [];

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await TwurpleAuthService.CallAuthFunctionAsync();
            var myName = await TwurpleAuthService.GetMyUserNameAsync();
            _streamerNames.Add(myName);
        }
    }

    private void AddStreamer()
    {
        _streamerNames.Add($"Streamer {_streamerNames.Count + 1}");
        StateHasChanged();
    }

    private void SortList(FluentSortableListEventArgs args)
    {
        if (args is null || args.OldIndex == args.NewIndex)
        {
            return;
        }

        var oldIndex = args.OldIndex;
        var newIndex = args.NewIndex;

        var items = this._streamerNames;
        var itemToMove = items[oldIndex];
        items.RemoveAt(oldIndex);

        if (newIndex < items.Count)
        {
            items.Insert(newIndex, itemToMove);
        }
        else
        {
            items.Add(itemToMove);
        }

        StateHasChanged();
    }

}
