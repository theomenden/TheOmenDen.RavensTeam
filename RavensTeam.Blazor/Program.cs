using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.FluentUI.AspNetCore.Components;
using RavensTeam.Blazor;
using RavensTeam.Blazor.Interop;
using Serilog;
using Serilog.Enrichers.Sensitive;
using Serilog.Formatting.Compact;
using Serilog.Sinks.SystemConsole.Themes;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentName()
    .Enrich.WithThreadName()
    .Enrich.WithThreadId()
    .Enrich.WithMachineName()
    .Enrich.WithMemoryUsage()
    .Enrich.WithSensitiveDataMasking(options => options.MaskingOperators = [new EmailAddressMaskingOperator()])
    .WriteTo.Async(a =>
    {
        a.Console(theme: AnsiConsoleTheme.Code);
        a.Debug(new CompactJsonFormatter());
        a.BrowserConsole();
    })
    .CreateLogger();

try
{
    var builder = WebAssemblyHostBuilder.CreateDefault(args);
    builder.RootComponents.Add<App>("#app");
    builder.RootComponents.Add<HeadOutlet>("head::after");

    builder.Services.AddFluentUIComponents();
    builder.Services.AddLogging(lb => lb.AddSerilog(dispose: true));
    builder.Services.AddBlazoredLocalStorage();
    builder.Services.AddScoped<ITwurpleAuthService, TwurpleAuthService>();
    builder.Services.AddScoped<IHelixService, HelixService>();
    builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new(builder.HostEnvironment.BaseAddress) });
    builder.Services.AddHttpClient("HelixApi", client =>
        {
            client.BaseAddress = new Uri("https://api.twitch.tv/helix/");
            client.DefaultRequestHeaders.Add("client-Id", "lalrvvljueuwdj1l778y6jcsuktevq");
        })
        .AddStandardResilienceHandler();
    await builder.Build().RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "An error occurred while starting the application");
}
finally
{
    await Log.CloseAndFlushAsync();
}
