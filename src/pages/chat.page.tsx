import React, { CSSProperties, ReactElement } from 'react';
import colorify from './modules/colorify';
import proxy from './modules/proxy';
import { Chatbox, MessageInput, MessageList } from './styles/chat';

function Chat() {
  const buffer = [] as string[];
  const [active, setActive] = React.useState<boolean>(false);
  const [overflowed, setOverflowed] = React.useState<boolean>(false);
  const [chatOpened, setChatOpened] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [msgInputStyle, setMsgInputStyle] = React.useState<CSSProperties>({});
  const [messages, setMessages] = React.useState<ReactElement[]>([])
  const msgInputRef = React.createRef<HTMLInputElement>();
  const msgListRef = React.createRef<HTMLDivElement>();
  const messagesRef = React.createRef<HTMLDivElement>();

  let timeout: ReturnType<typeof setTimeout>;
  let currentBufferIndex = -1;

  const checkOverflow = () => {
    if (messagesRef.current!.clientHeight > msgListRef.current!.clientHeight) {
      if (!overflowed) {
        setOverflowed(true)
      }
    } else if (overflowed) {
        setOverflowed(false)
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

  const addMessage = (msg: ReactElement) => {
    setMessages((messages) => {
      messages.push(msg)
      return messages
    })
  }

  const removeOldestMessage = () => {
    setMessages((messages) => {
      messages.shift()
      return messages
    })
  }

  React.useEffect(() => {    
    proxy.openChat = () => {
      clearTimeout(timeout);
      if (!chatOpened) {
        setActive(true);
        setMsgInputStyle({display: 'block', opacity: 1})
        msgInputRef.current!.focus();
        setChatOpened(true);
      }
    };

    proxy.closeChat = () => {
      if (chatOpened) {
        setActive(false);
        msgInputRef.current!.blur();
        setMsgInputStyle({display: 'none'})
        setChatOpened(false);
      }
    };

    proxy.addString = (text: string, prefix: string = "") => {
      if (messages.length > 100) {
        removeOldestMessage()
      }
      addMessage(<p> {prefix + colorify(text)} </p>);
      checkOverflow();
      highlightChat();
    };

    proxy.addMessage = (name, text) => proxy.addString(text, <b>${name}: </b>);
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

  const msgListClasses = () => `msglist ${overflowed ? "overflowed" : ""}`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="content">
      <Chatbox className={chatboxClasses()}>
        <MessageList className={msgListClasses()} ref={msgListRef}>
          <div className="messages" ref={messagesRef}>
            {messages}
          </div>
        </MessageList>
        <MessageInput className="msginput" style={msgInputStyle}>
          <form id="message" onSubmit={handleSubmit}>
            <input 
              type="text"
              spellCheck="false"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              ref={msgInputRef}
            />
          </form>
        </MessageInput>
      </Chatbox>
    </div>
  );
}

export default Chat;
