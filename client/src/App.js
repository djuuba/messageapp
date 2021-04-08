import React, { useState, useEffect } from "react";
import './App.scss';

const io = require('socket.io-client');
const socket = io('ws://localhost:4001');

const roomList = [
  'Grandmas knitting club',
  'Motor enthusiasts',
  'Cat corner',
  'Sports madlads'
]

function App() {
  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameIsChosen, setUserNameIsChosen] = useState(false);
  const [availableRooms, setAvailableRooms] = useState(roomList);
  const [roomname, setRoomname] = useState('');

  function handleUsername(e) {
    e.preventDefault();
      if (userName) {
        socket.emit('username', userName, error => {
          if (error) {
            console.log(error);
          }
        });
        setUserNameIsChosen(true);
        setUserName('');
      }
  }

  function handleRoom(roomname) {
    setRoomname(roomname);
  }

  function handleExit() {
    setRoomname('');
  }

  function handleChatSend(e) {
    e.preventDefault();
    if (inputMessage) {
      socket.emit('message', inputMessage);
      socket.on('message', (message) => {
        console.log(message);
      })
      setMessageList([...messageList, inputMessage]);
      setInputMessage('');
    }
  }

  useEffect(() => {
   
  })
 
  return (
    <div className="App">
      {!userNameIsChosen ?
        <div>
          <h2>Please choose a username to see available rooms.</h2>
          <form onSubmit={(e) => handleUsername(e)}>
            <input placeholder="Username" value={userName} onChange={(e) => { setUserName(e.target.value) }}></input>
            <input type="submit" value="send"></input>
          </form>
        </div>
      : !roomname ?
          <div>
            <h2>Available rooms:</h2>
            {availableRooms.map(roomname => {
              return (
                <div>
                  <div>{roomname}</div>
                  <button onClick={() => handleRoom(roomname)}>Join room</button>
                </div>)
            })}
          </div>
        :
          <div>
            <h2>Now in room: { roomname }</h2>
            <button onClick={() => {handleExit()}}>Exit room</button>
          </div>
      }
      <ul>
        {messageList.map(message => {
          return (
            <li>{message}</li>
          );
        })}
      </ul>
      <form onSubmit={(e) => {handleChatSend(e)}}>
        <input placeholder="message" value={inputMessage} onChange={(e) => {setInputMessage(e.target.value)}}></input>
        <input type="submit" value="send"></input>
      </form>
    </div>
  );
}

export default App;
