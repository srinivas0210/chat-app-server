const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})
users = []

const addUser = ({ id, name, room }) => {
    const isUserExist = users.find((user) => user.name === name && user.room === room)

    if (isUserExist) {
        return { error: 'user already exist' };
    }

    const user = { id, name, room };
    users.push(user);

    return { user };


}

const addVideo = ({ name, url }) => {
    console.log('added videoUrl');

    pool.query('INSERT INTO videofeed (name, videoUrl) VALUES ($1, $2)', [name, url], (error, results) => {
        if (error) {
            throw error
        }

    })
}

const getVideo = async (name) => {
    console.log('fetched video urls');
    console.log(name);

    const response = await pool.query('SELECT * FROM videofeed WHERE name = $1', [name])
    console.log('rows', response.rows)
    return response.rows
}

const addMessage = (data) => {
    const { name, message, time, room } = data;
    console.log("hi");
    pool.query('INSERT INTO chatdata (name, room,message,time) VALUES ($1, $2,$3,$4)', [name, room, message, time], (error, results) => {
        if (error) {
            throw error
        }

    })

}

const removeUser = (id) => {
    console.log(id, 'ssssss');
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
    addMessage,
    addVideo,
    getVideo,
}
