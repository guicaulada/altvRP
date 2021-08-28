let chatOpened = false;
let buffer = [] as string[];
let currentBufferIndex = -1;
let timeout: number;
let messagesBlock: HTMLElement | null;
let msgListBlock: HTMLElement | null;
let msgInputBlock: HTMLElement | null;
let msgInputLine: HTMLInputElement | null;

const colorify = (text: string) => {
  let matches = [];
  let m = null;
  let curPos = 0;

  do {
    m = /\{[A-Fa-f0-9]{3}\}|\{[A-Fa-f0-9]{6}\}/g.exec(text.substr(curPos));

    if (!m) {
      break;
    }

    matches.push({
      found: m[0],
      index: m["index"] + curPos,
    });

    curPos = curPos + m["index"] + m[0].length;
  } while (m != null);

  if (matches.length > 0) {
    text += "</font>";

    for (let i = matches.length - 1; i >= 0; --i) {
      let color = matches[i].found.substring(1, matches[i].found.length - 1);
      let insertHtml =
        (i != 0 ? "</font>" : "") + '<font color="#' + color + '">';
      text =
        text.slice(0, matches[i].index) +
        insertHtml +
        text.slice(matches[i].index + matches[i].found.length, text.length);
    }
  }

  return text;
};

const checkOverflow = () => {
  if (messagesBlock!.clientHeight > msgListBlock!.clientHeight) {
    if (!msgListBlock!.classList.contains("overflowed")) {
      msgListBlock!.classList.add("overflowed");
    }
  } else if (msgListBlock!.classList.contains("overflowed")) {
    msgListBlock!.classList.remove("overflowed");
  }
};

const saveBuffer = () => {
  if (buffer.length > 100) {
    buffer.pop();
  }
  buffer.unshift(msgInputLine!.value);
  currentBufferIndex = -1;
};

const loadBuffer = (idx: number) => {
  msgInputLine!.value = buffer[idx];
};

const highlightChat = () => {
  msgListBlock!.scrollTo({
    left: 0,
    top: msgListBlock!.scrollHeight,
    behavior: "smooth",
  });
  document.querySelector(".chatbox")!.classList.add("active");
  clearTimeout(timeout);
  timeout = setTimeout(
    () => document.querySelector(".chatbox")!.classList.remove("active"),
    4000
  );
};

proxy.openChat = () => {
  clearTimeout(timeout);
  if (!chatOpened) {
    document.querySelector(".chatbox")!.classList.add("active");
    msgInputBlock!.style.display = "block";
    msgInputBlock!.style.opacity = "1";
    msgInputLine!.focus();
    chatOpened = true;
  }
};

proxy.closeChat = () => {
  if (chatOpened) {
    document.querySelector(".chatbox")!.classList.remove("active");
    msgInputLine!.blur();
    msgInputBlock!.style.display = "none";
    chatOpened = false;
  }
};

proxy.addString = (text: string, prefix: string = "") => {
  if (messagesBlock!.children.length > 100) {
    messagesBlock!.removeChild(messagesBlock!.children[0]);
  }
  const msg = document.createElement("p");
  msg.innerHTML = prefix + colorify(text);
  messagesBlock!.appendChild(msg);
  checkOverflow();
  highlightChat();
};

proxy.addMessage = (name, text) => proxy.addString(text, `<b>${name}: </b>`);

window.addEventListener("load", () => {
  messagesBlock = document.querySelector(".messages");
  msgListBlock = document.querySelector(".msglist");
  msgInputBlock = document.querySelector(".msginput");
  msgInputLine = document.querySelector(".msginput input");

  document.querySelector("#message")!.addEventListener("submit", (e) => {
    e.preventDefault();
    proxy.chatMessage(msgInputLine!.value);
    saveBuffer();
    proxy.closeChat();
    msgInputLine!.value = "";
  });

  msgInputLine!.addEventListener("keydown", (e) => {
    if (e.code === "Tab") {
      e.preventDefault();
    } else if (e.code == "ArrowDown") {
      e.preventDefault();
      if (currentBufferIndex > 0) {
        loadBuffer(--currentBufferIndex);
      } else if (currentBufferIndex == 0) {
        currentBufferIndex = -1;
        msgInputLine!.value = "";
      }
    } else if (e.code == "ArrowUp") {
      e.preventDefault();
      if (currentBufferIndex < buffer.length - 1) {
        loadBuffer(++currentBufferIndex);
      }
    }
  });

  proxy.chatLoaded();
});
