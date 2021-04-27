# Chatlifier Instant Messaging App

![image](https://user-images.githubusercontent.com/21296522/116308542-e64b3e80-a7a7-11eb-99c1-f3c09c62ef66.png)

### Features

* Instant messaging through Socket.IO with Express.js backend and React frontend
* Users joining/leaving broadcasts notification to all other users in the room
* Own user's chat blobs are styled differently to better differentiate messages
* Automatically scrolls down on new messages

### How it works

#### Server side

Express.js server resides in `/server/app.js` and runs on port **4001** by default.\
All Socket.IO listeners and emitters are in this file.

All utility functions reside in `/server/utility.js`, along with some basic objects that serve as a simple database.\
If you want to add/remove rooms, simply change the **roomList** array in this file.  

![image](https://user-images.githubusercontent.com/21296522/116309248-d4b66680-a7a8-11eb-9f18-002261363e9d.png)

#### Client side

Main React source code resides in `/client/src/App.js` and runs on port **3000** by default.

