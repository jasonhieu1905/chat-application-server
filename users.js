const users = [];

const addUser = ({ id, name, room }) => {
  name = name.toString().trim();
  room = room.toString().trim();

  const existingUser = users.some(
    (user) => user.name === name && user.room === room
  );

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  users = users.filter((user) => user.id !== id);
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
