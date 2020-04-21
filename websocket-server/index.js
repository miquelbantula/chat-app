// dependencies

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;

const server = express().listen(3001);

const wss = new SocketServer({ server });

wss.on('connection', (ws, request, client) => {
    console.log(JSON.parse(request));
    console.log(`[Server] A client ${client} was connected with request ${request}.`);

    ws.on('close', () => console.log('[Server] Client was disconnected.'));

    ws.on('message', (message) => {
        console.log('[Server] Received message: %s', message);

        // we broadcast the message
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});