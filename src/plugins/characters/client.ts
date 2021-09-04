import { config, proxy } from "@client";
import * as alt from "alt-client";

proxy.client.loadCharacterCreation = () => {
  const view = proxy.webview(
    new alt.WebView(
      `http://${config.WEBSERVER_ADDRESS}/plugins/characters/creation`,
      true
    )
  );
  alt.showCursor(true);
  view.webview.focus();
};
