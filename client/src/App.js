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

  function RoomList() {
    if (userNameIsChosen) {
      return (
        <div>
          <h2>Available rooms</h2>
          <div className="rooms">
            {roomList.map(room => {
              return (
                <div className={`room${currentRoom === room ? ' active': ''}${currentRoom && currentRoom !== room ? ' inactive':''}`}>
                  <p>{room}</p>
                  {room === currentRoom ? 
                  <button type="button" className="btn btn-secondary" onClick={() => handleRoomExit()}>Exit room</button>
            :
            <button type="button" className="btn btn-success" onClick={() => handleRoomJoin(room)}>Join room</button>}
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  function UserDisplay() {
    return (
      <div className="userdisplay">
       
      </div>
    )
  }
 
  return (
    <div className="App">
      <div className="header">
      </div>
      <div className="roomlist">
        <RoomList />
      </div>
      { userNameIsChosen ?
        <div className="messagedisplay-container">
          <div className="messages">
            {messageList.map(message => {
              return (
                <div className="msg">
                  <div className="username">{message.user}</div>
                  <div className="messageblob">{message.message}</div>
                </div>
              )
            })}
          </div>
          <form className="chatinput" onSubmit={(e) => { handleChatSend(e) }}>
            <input
              disabled={currentRoom ? '' : 'disabled'}
              className="input"
              placeholder={currentRoom ? 'Enter message...' : 'Join a room to send messages'}
              value={inputMessage}
              onChange={(e) => { setInputMessage(e.target.value) }}>
            </input>
            {currentRoom ? <input className="button btn btn-primary" type="submit" value="Send"></input> : null}
          </form>
        </div>
        : null}
        <UserDisplay />
      { !userNameIsChosen ?
        <div>
          <h2>Please choose a username to see available rooms</h2>
          <form onSubmit={(e) => handleUsername(e)}>
            <input 
              placeholder="Username"
              value={userName} 
              onChange={(e) => { setUserName(e.target.value) }}>
            </input>
            <input type="submit" value="Enter"></input>
          </form>
        </div>
        : null}
    </div>
  );
}

export default App;
