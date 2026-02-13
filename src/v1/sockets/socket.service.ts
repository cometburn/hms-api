import { Server } from 'socket.io';

interface SocketService {
  io: Server | null;
  init: (io: Server) => void;
  emitToHotelUsers: (hotelId: string, event: string, data: any) => void;
  emitToUser: (userId: string, event: string, data: any) => void;
  emitToSocket: (socketId: string, event: string, data: any) => void;
  getHotelSockets: (hotelId: string) => Set<string> | undefined;
  isUserInHotel: (socketId: string, hotelId: string) => boolean;
}

export const socketService: SocketService = {
  io: null,

  init(io: Server): void {
    this.io = io;
  },

  emitToHotelUsers(hotelId: string, event: string, data: any): void {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }
    this.io.to(`hotel_${hotelId}`).emit(event, data);
  },

  emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }

    // Emit to all sockets belonging to this user
    // This assumes userId is stored in socket.data.userId
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.data.userId === userId) {
        socket.emit(event, data);
      }
    });
  },

  emitToSocket(socketId: string, event: string, data: any): void {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }
    this.io.to(socketId).emit(event, data);
  },

  getHotelSockets(hotelId: string): Set<string> | undefined {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return undefined;
    }
    return this.io.sockets.adapter.rooms.get(`hotel_${hotelId}`);
  },

  isUserInHotel(socketId: string, hotelId: string): boolean {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return false;
    }
    const socket = this.io.sockets.sockets.get(socketId);
    return socket ? socket.rooms.has(`hotel_${hotelId}`) : false;
  }
};