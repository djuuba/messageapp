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
      }
  }

  function handleRoomJoin(roomname) {
    setRoomname(roomname);
    socket.emit('joinroom', roomname);
  }

  function handleRoomExit() {
    socket.emit('leaveroom', roomname);
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
            {roomList.map(roomname => {
              return (
                <div>
                  <div>{roomname}</div>
                  <button onClick={() => handleRoomJoin(roomname)}>Join room</button>
                </div>)
            })}
          </div>
        :
          <div>
            <h2>Now in room: { roomname }</h2>
            <button onClick={() => {handleRoomExit()}}>Exit room</button>
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
