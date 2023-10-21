import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server, Socket } from 'socket.io';
  
interface ClientInfo {
    userId: string;
    displayName: string;
    client: Socket;
}

const clients = new Map<string, ClientInfo>();
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },  
  })
  export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('identify')
    identifyAndMapClient(client: Socket, data: ClientInfo) {
        clients.set(`'${data.userId}'`, {userId: data.userId, displayName: data.displayName, client: client});
    }

    getClientbyId(userId: string): ClientInfo {
        const client = clients.get(`'${userId}'`);
        return client;
    }
  }