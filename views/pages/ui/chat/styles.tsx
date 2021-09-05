import styled from "styled-components";

export const Chatbox = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 450px;
  height: 250px;
  padding: 15px;
  opacity: 0.7;
  transition: all 0.5s;

  & .active {
    opacity: 1;
  }

  & p {
    color: #fff;
    line-height: 25px;
    padding: 5px 0;
    margin: 0;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    font-size: 1em;
    color: rgba(255, 255, 255, 0.9);
    width: 100%;
    word-break: break-all;
    display: inline-block;
  }

  & p b {
    font-weight: 500;
  }

  @media screen and (max-width: 2560px) {
    & {
      font-size: 20px;
      width: 600px;
      height: 400px;
    }
  }

  @media screen and (max-width: 1440px) {
    & {
      font-size: 16px;
      width: 400px;
      height: 300px;
    }
  }

  @media screen and (max-width: 1280px) {
    & {
      font-size: 14px;
      width: 400px;
      height: 300px;
    }
  }

  @media screen and (max-width: 800px) {
    & {
      width: 350px;
      height: 200px;
    }
    & p {
      line-height: 16px;
    }
  }
`;

export const MessageList = styled.div`
  overflow-y: hidden;
  height: 100%;
  & .overflowed {
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 100%
    );
    -webkit-mask-image: -webkit-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 20%,
      rgba(0, 0, 0, 1) 100%
    );
  }
`;

export const MessageInput = styled.div`
  display: none;
  width: 100%;

  & input {
    background: rgba(0, 0, 0, 0.5);
    border: 0;
    padding: 10px;
    width: 430px;
    margin-left: 5px;
    margin-top: 10px;
    color: #fff;
    font-family: inherit;
    font-size: 1em;
  }

  & input:selection {
    background-color: #fff;
    color: #000;
  }

  @media screen and (max-width: 2560px) {
    & input {
      width: 580px;
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 1440px) {
    & input {
      width: 380px;
      margin-top: 10px;
    }
  }

  @media screen and (max-width: 1280px) {
    & input {
      width: 380px;
      margin-top: 10px;
    }
  }

  @media screen and (max-width: 800px) {
    & input {
      width: 330px;
      height: 15px;
      margin-top: 10px;
    }
  }
`;
