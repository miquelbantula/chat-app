// dependencies

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

const server = express().listen(3001);

const wss = new SocketServer({ server });
const users = [];
const messages = [];

wss.on('connection', (ws, request, client) => {
    console.log(`[Server] A client ${client} was connected with request ${request}.`);

    ws.on('close', () => console.log('[Server] Client was disconnected.'));

    ws.on('message', (message) => {
        const data = JSON.parse(message);


        messages.push(data);
        console.log('messages', messages);

        if (data.type === 'user-connection') {
            if (users.includes(data.userName)) {
                let m = {
                    type: 'error',
                    message: 'user name already exists!'
                }
                ws.send(JSON.stringify(m));
            } else {
                users.push(data.userName);
                let m = {
                    type: 'user-connection',
                    message: `${data.userName} joined`,
                    users: users
                }
                ws.send(JSON.stringify(m));
            }
        }

        if (data.type === 'edit') {
            let match = messages.find(message => message.id === data.id);
            if (match) {
                match.message = data.newMessage;
                match.type = 'editted';
                ws.send(JSON.stringify(match));
            } else {
                console.error('could not find the message to be editted');
            }
        }

        if (data.type === 'remove') {
            let match = messages.find(message => message.id === data.id);
            if (match) {
                match.message = 'message deleted';
                match.type = 'deleted';
                ws.send(JSON.stringify(match));
            } else {
                console.error('could not find the message to be editted');
            }
        }

        if (data.type === 'user-disconnection') {

        }


        if (data.type === 'message') {
            // we broadcast the message
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});