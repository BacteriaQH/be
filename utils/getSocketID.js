export const getSocketID = (io) => {
    var sockets = io.sockets.sockets;
    console.log(sockets);
    for (let [key, value] of sockets.entries()) {
        return key
    }
};