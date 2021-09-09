import * as alt from 'alt-client';
import * as proxy from 'core/client/proxy';
import config from 'core/config/shared';
import { WebProxy } from 'core/shared/types';
export interface Message {
  name: string | null;
  text: string;
}

const buffer = [] as Message[];

let loaded = false;
let opened = false;
let view: WebProxy;

alt.on('keyup', (key) => {
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

const addMessage = (name: string | null, text: string) => {
  if (view) {
    if (name) {
      view.addMessage(name, text);
    } else {
      view.addString(text);
    }
  }
};

proxy.client.chatMessage = (name: string | null, text: string) => {
  if (!loaded) {
    buffer.push({ name, text });
  } else {
    addMessage(name, text);
  }
};

proxy.client.loadChat = () => {
  if (!view) {
    view = proxy.webview(new alt.WebView(`${config.VIEWS_URL}/ui/chat`));

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

    proxy.client.chatMessage(null, 'alt:V Multiplayer has started');
  }
};
