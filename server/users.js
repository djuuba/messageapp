let users = [];

function addUser(id, userName, room) {
    if (!users.includes(id)) {
        const user = {
            id: id,
            userName: userName,
            room: room
        };
        users.push(user);
        return user;
    } else {
        throw 'User already exists.';
    }
}

function getUser(id) {
  if (users.includes(id)) {
      return users.filter(obj => {
          return obj.id === id
      })
  } else {
      throw 'User doesn\'t exist';
  }
}

function deleteUser(id) {
  if (users.includes(id)) {
    users = users.filter(key => {
        return !key.id;
    })
    console.log(`Removed user with id ${id}.`);
  } else {
      throw 'User doesn\'t exist';
  }
}

function getUsers() {
    return users;
}

module.exports = { addUser, getUser, deleteUser, getUsers }