import React from 'react';
import colorify from '../../modules/colorify';
import proxy from '../../modules/proxy';
import './style.css';

function Chat() {
  const buffer = [] as string[];
  const chatboxRef = React.createRef<HTMLDivElement>();
  const messagesRef = React.createRef<HTMLDivElement>();
  const msgListRef = React.createRef<HTMLDivElement>();
  const msgInputDivRef = React.createRef<HTMLDivElement>();
  const msgInputRef = React.createRef<HTMLInputElement>();

  let timeout: ReturnType<typeof setTimeout>;
  let currentBufferIndex = -1;
  let chatOpened = false;

  const checkOverflow = () => {
    if (messagesRef.current!.clientHeight > msgListRef.current!.clientHeight) {
      if (!msgListRef.current!.classList.contains("overflowed")) {
        msgListRef.current!.classList.add("overflowed");
      }
    } else if (msgListRef.current!.classList.contains("overflowed")) {
      msgListRef.current!.classList.remove("overflowed");
    }
  };

  const saveBuffer = () => {
    if (buffer.length > 100) {
      buffer.pop();
    }
    buffer.unshift(msgInputRef.current!.value);
    currentBufferIndex = -1;
  };

  const loadBuffer = (idx: number) => {
    msgInputRef.current!.value = buffer[idx];
  };

  const highlightChat = () => {
    msgListRef.current!.scrollTo({
      left: 0,
      top: msgListRef.current!.scrollHeight,
      behavior: "smooth",
    });
    chatboxRef.current!.classList.add("active");
    clearTimeout(timeout);
    timeout = setTimeout(
      () => chatboxRef.current!.classList.remove("active"),
      4000
    );
  };

  proxy.openChat = () => {
    clearTimeout(timeout);
    if (!chatOpened) {
      chatboxRef.current!.classList.add("active");
      msgInputDivRef.current!.style.display = "block";
      msgInputDivRef.current!.style.opacity = "1";
      msgInputRef.current!.focus();
      chatOpened = true;
    }
  };

  proxy.closeChat = () => {
    if (chatOpened) {
      chatboxRef.current!.classList.remove("active");
      msgInputRef.current!.blur();
      msgInputDivRef.current!.style.display = "none";
      chatOpened = false;
    }
  };

  proxy.addString = (text: string, prefix: string = "") => {
    if (messagesRef.current!.children.length > 100) {
      messagesRef.current!.removeChild(messagesRef.current!.children[0]);
    }
    const msg = document.createElement("p");
    msg.innerHTML = prefix + colorify(text);
    messagesRef.current!.appendChild(msg);
    checkOverflow();
    highlightChat();
  };

  proxy.addMessage = (name, text) => proxy.addString(text, `<b>${name}: </b>`);

  React.useEffect(() => {
    proxy.chatLoaded();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    proxy.chatMessage(msgInputRef.current!.value);
    saveBuffer();
    proxy.closeChat();
    msgInputRef.current!.value = "";
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Tab") {
      e.preventDefault();
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      if (currentBufferIndex > 0) {
        loadBuffer(--currentBufferIndex);
      } else if (currentBufferIndex === 0) {
        currentBufferIndex = -1;
        msgInputRef.current!.value = "";
      }
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      if (currentBufferIndex < buffer.length - 1) {
        loadBuffer(++currentBufferIndex);
      }
    }
  }

  return (
    <div className="content">
      <div className="chatbox" ref={chatboxRef}>
        <div className="msglist" ref={msgListRef}>
          <div className="messages" ref={messagesRef}></div>
        </div>
        <div className="msginput" ref={msgInputDivRef}>
          <form id="message" onSubmit={handleSubmit}>
            <input type="text" spellCheck="false" onKeyDown={handleKeyDown} ref={msgInputRef} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
