import * as alt from "alt-client";
import * as proxy from "core/client/proxy";

proxy.client.loadCharacterCreation = (url: string) => {
  const view = proxy.webview(new alt.WebView(url, true));
  alt.showCursor(true);
  view.webview.focus();
};
