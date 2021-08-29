import * as alt from "alt-client";
import * as proxy from "./proxy";

let view: proxy.WebProxy;

proxy.client.loadLogin = (state: string) => {
  view = proxy.webview(
    new alt.WebView(
      "https://discord.com/api/oauth2/authorize?" +
        "client_id=880926468610343003" +
        "&redirect_uri=http%3A%2F%2Fsighmir.io%3A7789%2Fauthorize" +
        `&state=${encodeURIComponent(state)}` +
        "&response_type=code" +
        "&scope=identify%20email"
    )
  );
  alt.toggleGameControls(false);
  alt.showCursor(true);
  view.webview.focus();
};

proxy.client.closeLogin = () => {
  alt.toggleGameControls(true);
  alt.showCursor(false);
  view.webview.unfocus();
  view.webview.destroy();
};
