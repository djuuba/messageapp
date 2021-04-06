import React, { useState, useEffect } from "react";
import './App.scss';

const io = require('socket.io-client');

const socket = io('ws://localhost:4001');

function App() {
  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  function handleChatSend(e) {
    e.preventDefault();
    if (inputMessage) {
      socket.emit('message', inputMessage);
      setMessageList([...messageList, inputMessage]);
      setInputMessage('');
    }
  }

  useEffect(() => {
    
  }, [])
 
  return (
    <div className="App">
      <ul>
        {messageList.map(message => {
          return (
            <li>{message}</li>
          );
        })}
      </ul>
      <form onSubmit={(e) => {handleChatSend(e)}}>
        <input placeholder="message" value={inputMessage} onChange={(e) => {setInputMessage(e.target.value)}}></input>
        <input type="submit" value="submit"></input>
      </form>
    </div>
  );
}

export default App;
