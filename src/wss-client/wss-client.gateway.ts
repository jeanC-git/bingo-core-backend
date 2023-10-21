import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class WssClientGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(

  ) {

  }

  async handleConnection(client: Socket) {

    // console.log({ client: client.id });

  }

  handleDisconnect(client: Socket) {
    // console.log({ client });
  }

  // @SubscribeMessage('GameRoomEventStatusUpdate')
  // handleGameRoomEventStatusUpdate(client: Socket, payload: any) {

  //   console.log({ client: client.id, payload });

  // }

}
