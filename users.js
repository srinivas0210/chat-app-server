users = []

const addUser = ({ id, name, room }) => {
    const isUserExist = users.find((user) => user.name === name && user.room === room)

    if (isUserExist) {
        return { error: 'user already exist' };
    }

    const user = { id, name, room };
    users.push(user);

    return {user};


}

const removeUser = (id) => {
    console.log(id,'ssssss');
    const user = users.find((user) => user.id === id);
    users.splice(user.id, 1);

    return users;
}

const getUser = (id) => {
    console.log(id);
    const user = users.find((user) => user.id === id);
    console.log(user, 'in backend');

    return user;
}

const getUsersFromRoom = (room) => {
    const usersfromroom = [];
    users.map((user) => {
        if (user.room === room) return usersfromroom.push(user);
    });

    return usersfromroom;
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersFromRoom,
}
