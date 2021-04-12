let users = [];
let roomList = [
    'Grandmas knitting club',
    'Motor enthusiasts',
    'Cat corner',
    'Sports madlads'
  ]

function addUser(id, userName) {
    if (!users.includes(id)) {
        const user = {
            id: id,
            userName: userName,
            room: ''
        };
        users.push(user);
        return user;
    } else {
        throw 'User already exists.';
    }
}

function getUser(id) {
    let user;

    if (users.some(e => e.id === id)) {
       user = users.find(obj => {
          return obj.id === id;
      }).userName;
      return user;
  } else {
      console.log('Can\'t get user - user doesn\'t exist.');
  }
}

function deleteUser(id) {
  if (users.some(e => e.id === id)) {
    users = users.filter(key => {
        return key.id != id;
    })
    console.log(`Removed user with id ${id}.`);
  } else {
      console.log('Can\'t delete user - user doesn\'t exist.');
  }
}

function getUsers() {
    return users;
}

function getRoomList() {
    return roomList;
}

module.exports = { addUser, getUser, deleteUser, getUsers, getRoomList }