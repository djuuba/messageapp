let users = {};
let roomList = [
    'Grandmas knitting club',
    'Motor enthusiasts',
    'Cat corner',
    'Sports madlads'
  ]

let messageList = {

}

function populateMessageList() {
    roomList.map(item => {
        messageList = {
            ...messageList,
            [item]: []
        }
    })
}

/*
let messageList = {
  Grandmas knitting club: [
      {
          User: 'johnny',
          Message: 'heey'
      },
      {
          User: 'jane',
          Message: 'sup :D'
      }
    ]
}
*/

populateMessageList();

function saveMessage(user, room, message) {
  messageList[room].push({
      user: user,
      message: message
  })
  console.log(messageList);
}

function getMessageList(room) {
  return messageList[room];
}

function addUser(id, userName) {
    if (!([id] in users)) {
        users = {
            ...users,
            [`${id}`]: {
                userName: userName,
                room: ''
            }
        }
    } else {
      console.log('Can\'t add user - user already exists.');
    }
}


function getUser(id) {
    if ([id] in users) {
      return users[id].userName;
    } else {
      console.log('Can\'t get user - user doesn\'t exist.');
  }
}

function getCurrentRoom(id) {
    return users[id].room
};

function deleteUser(id) {
    if ([id] in users) {
        delete users[id];
        console.log(`Removed user with id ${id}.`);
    } else {
        console.log('Can\'t delete user - user doesn\'t exist.');
    }
}

function joinRoom(id, room) {
    users[id].room = room
    console.log(users)
}

function leaveRoom(id, room) {
    users[id].room = '';
    console.log(users)
}

function getUsers() {
    return users;
}

function getRoomList() {
    return roomList;
}

module.exports = { addUser, getUser, deleteUser, getUsers, getRoomList, joinRoom, leaveRoom, getCurrentRoom, saveMessage, getMessageList }