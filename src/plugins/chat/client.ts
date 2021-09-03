import { config, proxy } from "@client";
import * as alt from "alt-client";

interface Message {
  name: string | null;
  text: string;
}

const buffer = [] as Message[];

let loaded = false;
let opened = false;

proxy.client.loadChat = () => {
  const view = proxy.webview(
    new alt.WebView(`http://${config.WEBSERVER_ADDRESS}/plugins/chat`)
  );

  const addMessage = (name: string | null, text: string) => {
    if (name) {
      view!.addMessage(name, text);
    } else {
      view!.addString(text);
    }
  };

  view.chatLoaded = () => {
    for (const msg of buffer) {
      addMessage(msg.name, msg.text);
    }
    loaded = true;
  };

  view.chatMessage = (text) => {
    proxy.server.chatMessage(text);
    opened = false;
    alt.toggleGameControls(true);
    view.webview.unfocus();
  };

  alt.on("keyup", (key) => {
    if (loaded) {
      if (!opened && key === 0x54 && alt.gameControlsEnabled()) {
        opened = true;
        view.openChat();
        alt.toggleGameControls(false);
        view.webview.focus();
      } else if (opened && key == 0x1b) {
        opened = false;
        view.closeChat();
        alt.toggleGameControls(true);
        view.webview.unfocus();
      }
    }
  });

  proxy.client.chatMessage = (name: string | null, text: string) => {
    if (!loaded) {
      buffer.push({ name, text });
    } else {
      addMessage(name, text);
    }
  };

  proxy.client.chatMessage(null, "alt:V Multiplayer has started");
};
