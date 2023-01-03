import React from "react";
import { readFileSync } from "fs";
import { io } from "socket.io-client";

const ChatBox = () => {
  const socket = io("/");

  const messages = document.getElementById("messages") as HTMLUListElement;
  const form = document.getElementById("form") as HTMLFormElement;
  const input = document.getElementById("input") as HTMLInputElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit("chat message", input.value);
      input.value = "";
    }
  });

  socket.on("chat message", (msg: string) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  return (
    <div className="">
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
