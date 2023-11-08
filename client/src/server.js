import io from 'socket.io-client';

let socket;

const connectSocket = (userId) => {
    socket = io('http://localhost:3005', {
        query: `userId=${userId}`,
    })
}

export {socket, connectSocket}