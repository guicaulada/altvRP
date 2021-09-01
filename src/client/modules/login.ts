import * as alt from "alt-client";
import * as proxy from "./proxy";

let view: proxy.WebProxy;

proxy.client.loadLogin = (state: string) => {
  view = proxy.webview(
    new alt.WebView(
      "https://discord.com/api/oauth2/authorize?" +
        `client_id=${process.env.ALTV_APP_CLIENT}` +
        `&redirect_uri=${encodeURIComponent(
          "http://sighmir.io:7789/authorize"
        )}` +
        `&state=${encodeURIComponent(state)}` +
        "&response_type=code" +
        `&scope=${encodeURIComponent("identify email")}`
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
