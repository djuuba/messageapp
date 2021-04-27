import React, { useState, useEffect, useRef } from "react";
import './App.scss';
import useDeepCompareEffect from 'use-deep-compare-effect'
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
  const [userJoined, setUserJoined] = useState();
  const [userLeft, setUserLeft] = useState()
  const messagesEnd = useRef(null);

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

  function handleRoomJoin(room) {
    setCurrentRoom(room);
    socket.emit('joinroom', room, currentRoom);
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
      
      setInputMessage('');
    }
    
  }

  function scrollToBottom() {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect( () => {
    async function getRoomList() {
      const result = await Axios('http://localhost:4001/roomlist');
      setRoomList(result.data);
    }
    getRoomList();
  }, [])

  // Automatically scroll to bottom on new messages
  useDeepCompareEffect( () => {
    scrollToBottom();
  }, [messageList]);

  useEffect( () => {
    socket.on('joinroom', (user) => {
      setUserJoined(user);
      console.log(user);
    })
    socket.on('leaveroom', (user) => {
      setUserLeft(user);
    })
    socket.on('message', (message) => {
      setMessageList(message);
    })
  }, []);

  // These useEffects sets timers for room join/leave notifications
  useEffect( () => {
    const timer = setTimeout(() => setUserJoined(null), 4000);
    return () => clearTimeout(timer);
  }, [userJoined]);

  useEffect( () => {
    const timer = setTimeout(() => setUserLeft(null), 4000);
    return () => clearTimeout(timer);
  }, [userLeft]);

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
            <div className={`notificationbox${(userJoined || userLeft) ? ' show' : ' hidden'}`}><p>{ userJoined ? `${userJoined} joined the room` : `${userLeft} left the room` }</p></div>
            {messageList.map(message => {
              return (
                <div className={`msg${message.user === userName ? ' currentuser' : ' '}`}>
                  <div className="username">{message.user}</div>
                  <div className="messageblob">{message.message}</div>
                </div>
              )
            })}
            <div style={{ float:"left", clear: "both" }}
             ref={messagesEnd}>
            </div>
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
