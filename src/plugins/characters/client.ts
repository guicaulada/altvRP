import { proxy } from "@client";
import * as alt from "alt-client";

proxy.client.loadCharacterCreation = (url: string) => {
  const view = proxy.webview(new alt.WebView(url, true));
  alt.showCursor(true);
  view.webview.focus();
};
