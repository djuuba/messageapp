import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import './App.scss';

const ENDPOINT = "http://127.0.0.1:4001";

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    })
  }, [])

  return (
    <div className="App">
      It's <time dateTime={response}>{response}</time>
    </div>
  );
}

export default App;
