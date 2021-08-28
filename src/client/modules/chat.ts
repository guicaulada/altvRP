import * as alt from "alt-client";
import * as proxy from "../modules/proxy";

interface Message {
  name: string | null;
  text: string;
}

const view = proxy.webview("http://resource/dist/public/html/chat.html");
const buffer = [] as Message[];

let loaded = false;
let opened = false;

const addMessage = (name: string | null, text: string) => {
  if (name) {
    view.addMessage(name, text);
  } else {
    view.addString(text);
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
  view.unfocus();
};

proxy.client.chatMessage = (name: string | null, text: string) => {
  if (!loaded) {
    buffer.push({ name, text });
  } else {
    addMessage(name, text);
  }
};

export const pushLine = (text: string) => {
  proxy.client.chatMessage(null, text);
};

alt.on("keyup", (key) => {
  if (loaded) {
    if (!opened && key === 0x54 && alt.gameControlsEnabled()) {
      opened = true;
      view.openChat(false);
      alt.toggleGameControls(false);
      console.log(view.focus.toString());
      view.focus();
    } else if (!opened && key === 0xbf && alt.gameControlsEnabled()) {
      opened = true;
      view.openChat(true);
      alt.toggleGameControls(false);
      view.focus();
    } else if (opened && key == 0x1b) {
      opened = false;
      view.closeChat();
      alt.toggleGameControls(true);
      view.unfocus();
    }
  }
});

pushLine("<b>alt:V Multiplayer has started</b>");
