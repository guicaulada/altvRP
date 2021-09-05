import colorify from '@modules/colorify';
import * as proxy from '@modules/proxy';
import React from 'react';
import { Chatbox, MessageInput, MessageList } from './styles';

function Chat() {
  const buffer = [] as string[];
  const chatboxRef = React.createRef<HTMLDivElement>();
  const messagesRef = React.createRef<HTMLDivElement>();
  const msgListRef = React.createRef<HTMLDivElement>();
  const msgInputDivRef = React.createRef<HTMLDivElement>();
  const msgInputRef = React.createRef<HTMLInputElement>();

  let timeout: ReturnType<typeof setTimeout>;
  let currentBufferIndex = -1;

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

  React.useEffect(() => {
    let chatOpened = false;
    
    proxy.view.openChat = () => {
      clearTimeout(timeout);
      if (!chatOpened) {
        chatboxRef.current!.classList.add("active");
        msgInputDivRef.current!.style.display = "block";
        msgInputDivRef.current!.style.opacity = "1";
        msgInputRef.current!.focus();
        chatOpened = true;
      }
    };

    proxy.view.closeChat = () => {
      if (chatOpened) {
        chatboxRef.current!.classList.remove("active");
        msgInputRef.current!.blur();
        msgInputDivRef.current!.style.display = "none";
        chatOpened = false;
      }
    };

    proxy.view.addString = (text: string, prefix: string = "") => {
      if (messagesRef.current!.children.length > 100) {
        messagesRef.current!.removeChild(messagesRef.current!.children[0]);
      }
      const msg = document.createElement("p");
      msg.innerHTML = prefix + colorify(text);
      messagesRef.current!.appendChild(msg);
      checkOverflow();
      highlightChat();
    };

    proxy.view.addMessage = (name, text) => proxy.view.addString(text, `<b>${name}: </b>`);
    proxy.view.chatLoaded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    proxy.view.chatMessage(msgInputRef.current!.value);
    saveBuffer();
    proxy.view.closeChat();
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
      <Chatbox className="chatbox" ref={chatboxRef}>
        <MessageList className="msglist" ref={msgListRef}>
          <div className="messages" ref={messagesRef}></div>
        </MessageList>
        <MessageInput className="msginput" ref={msgInputDivRef}>
          <form id="message" onSubmit={handleSubmit}>
            <input type="text" spellCheck="false" onKeyDown={handleKeyDown} ref={msgInputRef} />
          </form>
        </MessageInput>
      </Chatbox>
    </div>
  );
}

export default Chat;
