// dependencies

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

const server = express().listen(3001);

const wss = new SocketServer({ server });
const users = [];

wss.on('connection', (ws, request, client) => {
    console.log(`[Server] A client ${client} was connected with request ${request}.`);

    ws.on('close', () => console.log('[Server] Client was disconnected.'));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'user-connection') {
            users.push(data.userName);
            let message = {
                type: 'activeUsers',
                users: users
            }
            ws.send(JSON.stringify(message));
        }

        console.log('[Server] Received message: %s', data);

        console.log('data.type', data.type);
        // we broadcast the message
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});