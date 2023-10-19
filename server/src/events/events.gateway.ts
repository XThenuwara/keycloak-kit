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
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },  
  })
  export class EventsGateway {
    @WebSocketServer()
    server: Server;


    handleConnection(client: Socket, ...args: any[]) {
        console.log('handleConnection');
    }


    @SubscribeMessage('events')
    handleEvent(client: Socket, data: string): string {
        console.log(data);
        return data;
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, data: string): string {
        console.log(data);
        return data;
    }
  }