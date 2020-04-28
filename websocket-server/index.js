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

    ws.on('close', (message) => {
        const data = JSON.parse(message);
        console.log('[Server] Client was disconnected.', data);
        users.splice(message.userName);
        let m = {
            type: 'user-connection',
            message: `${data.userName} left`,
            users: users
        }
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(m));
            }
        });
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        messages.push(data);

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
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(m));
                    }
                });
            }
        }

        if (data.type === 'edit') {
            let match = messages.find(message => message.id === data.id);
            if (match) {
                match.message = data.newMessage;
                match.type = 'editted';
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(match));
                    }
                });
            } else {
                console.error('could not find the message to be editted');
            }
        }

        if (data.type === 'remove') {
            let match = messages.find(message => message.id === data.id);
            if (match) {
                match.message = 'message deleted';
                match.type = 'deleted';
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(match));
                    }
                });
            } else {
                console.error('could not find the message to be editted');
            }
        }

        if (data.type === 'user-disconnection') {
            users.splice(message.userName);
            let m = {
                type: 'user-connection',
                message: `${data.userName} left`,
                users: users
            }
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(m));
                }
            });
        }


        if (data.type === 'message') {
            // we broadcast the message to everyone except ourselves
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});