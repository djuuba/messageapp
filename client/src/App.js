import React, { useState, useEffect } from "react";
import './App.scss';
const Axios = require('axios');

const io = require('socket.io-client');
const socket = io('ws://localhost:4001');

function App() {
  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameIsChosen, setUserNameIsChosen] = useState(false);
  const [roomList, setRoomList] = useState();
  const [currentRoom, setCurrentRoom] = useState('');

  function handleUsername(e) {
    e.preventDefault();
      if (userName) {
        socket.emit('username', userName, error => {
          if (error) {
            console.log(error);
          }
        });
        setUserNameIsChosen(true);
      }
  }

  function handleRoomJoin(currentRoom) {
    setCurrentRoom(currentRoom);
    socket.emit('joinroom', currentRoom);
    socket.on('getmessages', (message) => {
      setMessageList(message);
    })
  }

  function handleRoomExit() {
    socket.emit('leaveroom', currentRoom);
    setCurrentRoom('');
    setMessageList([]);
  }

  function handleChatSend(e) {
    e.preventDefault();
    if (inputMessage) {
      socket.emit('message', inputMessage);
      socket.on('message', (message) => {
        setMessageList(message);
        console.log(message);
      })
      setInputMessage('');
    }
  }

  useEffect( () => {
    async function getRoomList() {
      const result = await Axios('http://localhost:4001/roomlist');
      setRoomList(result.data);
    }
    
    getRoomList();
  }, [])

  useEffect( () => {
    socket.on('joinroom', (notification) => {
      console.log(notification);
    })
    socket.on('leaveroom', (notification) => {
      console.log(notification);
    })
  }, []);
 
  return (
    <div className="App">
      <div className="roomlist">
        {!userNameIsChosen ?
          <div>
            <h2>Please choose a username to see available rooms</h2>
            <form onSubmit={(e) => handleUsername(e)}>
              <input placeholder="Username" value={userName} onChange={(e) => { setUserName(e.target.value) }}></input>
              <input type="submit" value="send"></input>
            </form>
          </div>
          : !currentRoom ?
            <div>
              <h2>Available rooms:</h2>
              <div className="rooms">
                {roomList.map(room => {
                  return (
                    <div className="room">
                      <p>{room}</p>
                      <button onClick={() => handleRoomJoin(room)}>Join room</button>
                    </div>)
                })}
              </div>
            </div>
            :
            <div>
              <p>Now in room {currentRoom}</p>
              <button onClick={() => { handleRoomExit() }}>Exit room</button>
            </div>
        }
      </div>
      <div className="messages">
        <ul>
          {messageList.map(message => {
            return (
              <li>{message.user} said {message.message}</li>
            );
          })}
        </ul>
        <form onSubmit={(e) => { handleChatSend(e) }}>
          <input placeholder="message" value={inputMessage} onChange={(e) => { setInputMessage(e.target.value) }}></input>
          <input type="submit" value="send"></input>
        </form>
      </div>
    </div>
  );
}

export default App;
