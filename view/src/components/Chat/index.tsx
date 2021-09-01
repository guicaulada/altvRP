import React, { CSSProperties } from 'react';
import colorify from '../../modules/colorify';
import proxy from '../../modules/proxy';
import { Chatbox, MessageInput, MessageList } from './style';
import './style.ts';

function Chat() {
  const buffer = [] as string[];
  const [active, setActive] = React.useState<boolean>(false);
  const [msgInputStyle, setMsgInputStyle] = React.useState<CSSProperties>({});
  const [inputValue, setInputValue] = React.useState<string>("");
  const messagesRef = React.createRef<HTMLDivElement>();
  const msgListRef = React.createRef<HTMLDivElement>();

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
    buffer.unshift(inputValue);
    currentBufferIndex = -1;
  };

  const loadBuffer = (idx: number) => {
    setInputValue(buffer[idx])
  };

  const highlightChat = () => {
    msgListRef.current!.scrollTo({
      left: 0,
      top: msgListRef.current!.scrollHeight,
      behavior: "smooth",
    });
    setActive(true);
    clearTimeout(timeout);
    timeout = setTimeout(
      () => setActive(false),
      4000
    );
  };

  proxy.openChat = () => {
    clearTimeout(timeout);
    if (!chatOpened) {
      setActive(true);
      setMsgInputStyle({display: 'block', opacity: 1})
      msgInputRef.current!.focus();
      chatOpened = true;
    }
  };

  proxy.closeChat = () => {
    if (chatOpened) {
      setActive(false);
      msgInputRef.current!.blur();
      setMsgInputStyle({display: 'none'})
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
    proxy.chatMessage(inputValue);
    saveBuffer();
    proxy.closeChat();
    setInputValue("")
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
        setInputValue("")
      }
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      if (currentBufferIndex < buffer.length - 1) {
        loadBuffer(++currentBufferIndex);
      }
    }
  }

  const chatboxClasses = () => `chatbox ${active ? "active" : ""}`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="content">
      <Chatbox className={chatboxClasses()}>
        <MessageList className="msglist" ref={msgListRef}>
          <div className="messages" ref={messagesRef}></div>
        </MessageList>
        <MessageInput className="msginput" style={msgInputStyle}>
          <form id="message" onSubmit={handleSubmit}>
            <input 
              type="text"
              spellCheck="false"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
            />
          </form>
        </MessageInput>
      </Chatbox>
    </div>
  );
}

export default Chat;
