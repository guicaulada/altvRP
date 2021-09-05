import { proxy } from "@client";
import * as alt from "alt-client";

let view: proxy.WebProxy;

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
