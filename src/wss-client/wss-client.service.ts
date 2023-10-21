import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WssClientService {

    @WebSocketServer() wss: Server;
    @WebSocketServer() client: Socket;

    constructor() {

    }


    async publishEvent() {
        console.log('publicando evento....');

        this.client.emit('GameRoomEventStatusUpdate', { someData: 'some-data' });
    }
}
