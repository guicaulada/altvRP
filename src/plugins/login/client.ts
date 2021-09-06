import * as alt from "alt-client";
import * as proxy from "core/client/proxy";
import { WebProxy } from "core/shared/types";

let view: WebProxy;

proxy.client.loadLogin = (state: string, client: string, redirect: string) => {
  view = proxy.webview(
    new alt.WebView(
      "https://discord.com/api/oauth2/authorize?" +
        `client_id=${client}` +
        `&redirect_uri=${encodeURIComponent(redirect)}` +
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
