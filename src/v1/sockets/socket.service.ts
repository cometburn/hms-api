import { Server, Socket } from "socket.io";

export class SocketService {
    private io: Server | null = null;

    /**
     * Initialize Socket.IO server
     */
    init(io: Server): void {
        this.io = io;
    }

    /**
     * Get the Socket.IO server instance
     */
    getIO(): Server {
        if (!this.io) {
            throw new Error("Socket.IO not initialized. Call init() first.");
        }
        return this.io;
    }

    /**
     * Emit event to all users in a hotel room
     */
    emitToHotelUsers(hotelId: string, event: string, data: any): void {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        this.io.to(`hotel_${hotelId}`).emit(event, data);
    }

    /**
     * Emit event to a specific user (all their connected sockets)
     */
    emitToUser(userId: string, event: string, data: any): void {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }

        // Emit to all sockets belonging to this user
        this.io.sockets.sockets.forEach((socket: Socket) => {
            if (socket.data.userId === userId) {
                socket.emit(event, data);
            }
        });
    }

    /**
     * Emit event to a specific socket by socket ID
     */
    emitToSocket(socketId: string, event: string, data: any): void {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        this.io.to(socketId).emit(event, data);
    }

    /**
     * Get all socket IDs in a hotel room
     */
    getHotelSockets(hotelId: string): Set<string> | undefined {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return undefined;
        }
        return this.io.sockets.adapter.rooms.get(`hotel_${hotelId}`);
    }

    /**
     * Check if a socket is in a specific hotel room
     */
    isUserInHotel(socketId: string, hotelId: string): boolean {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return false;
        }
        const socket = this.io.sockets.sockets.get(socketId);
        return socket ? socket.rooms.has(`hotel_${hotelId}`) : false;
    }

    /**
     * Join a socket to a hotel room
     */
    joinHotelRoom(socketId: string, hotelId: string): void {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
            socket.join(`hotel_${hotelId}`);
        }
    }

    /**
     * Remove a socket from a hotel room
     */
    leaveHotelRoom(socketId: string, hotelId: string): void {
        if (!this.io) {
            console.error("Socket.IO not initialized");
            return;
        }
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
            socket.leave(`hotel_${hotelId}`);
        }
    }

    /**
     * Get count of connected sockets in a hotel room
     */
    getHotelSocketCount(hotelId: string): number {
        const sockets = this.getHotelSockets(hotelId);
        return sockets ? sockets.size : 0;
    }

    /**
     * Check if Socket.IO is initialized
     */
    isInitialized(): boolean {
        return this.io !== null;
    }
}

export const socketService = new SocketService();