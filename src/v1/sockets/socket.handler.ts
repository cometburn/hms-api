import { Server, Socket } from "socket.io";

export class SocketHandlers {
    /**
     * Register all socket event handlers
     */
    register(io: Server): void {
        io.on("connection", (socket: Socket) => {
            this.handleConnection(io, socket);
        });
    }

    /**
     * Handle new socket connection
     */
    private handleConnection(io: Server, socket: Socket): void {
        const userId = socket.data.userId;
        const userEmail = socket.data.userEmail;

        console.log(`User ${userId} (${userEmail}) connected with socket ${socket.id}`);

        // Register all event handlers
        this.handleJoinHotel(socket, userId);
        this.handleLeaveHotel(socket, userId);
        this.handleSendMessage(socket, userId, userEmail);
        this.handleGetHotelUsers(io, socket);
        this.handleDisconnect(socket, userId);
        this.handleError(socket, userId);
    }

    /**
     * Handle join_hotel event
     */
    private handleJoinHotel(socket: Socket, userId: number): void {
        socket.on("join_hotel", async (hotelId: string, callback?: (response: any) => void) => {
            try {
                const roomName = `hotel_${hotelId}`;

                // Join the room
                socket.join(roomName);

                console.log(`🏨 User ${userId} joined ${roomName}`);

                // Notify others in the room
                socket.to(roomName).emit("user_joined", {
                    userId,
                    socketId: socket.id,
                    timestamp: new Date(),
                });

                // Send success response
                if (callback) {
                    callback({
                        success: true,
                        message: `Joined hotel ${hotelId}`,
                    });
                }
            } catch (error) {
                console.error("Error joining hotel:", error);
                if (callback) {
                    callback({
                        success: false,
                        error: "Failed to join hotel",
                    });
                }
            }
        });
    }

    /**
     * Handle leave_hotel event
     */
    private handleLeaveHotel(socket: Socket, userId: number): void {
        socket.on("leave_hotel", (hotelId: string, callback?: (response: any) => void) => {
            const roomName = `hotel_${hotelId}`;

            socket.leave(roomName);

            console.log(`🚪 User ${userId} left ${roomName}`);

            socket.to(roomName).emit("user_left", {
                userId,
                socketId: socket.id,
                timestamp: new Date(),
            });

            if (callback) {
                callback({
                    success: true,
                    message: `Left hotel ${hotelId}`
                });
            }
        });
    }

    /**
     * Handle send_message event
     */
    private handleSendMessage(socket: Socket, userId: number, userEmail: string): void {
        socket.on(
            "send_message",
            async (
                data: {
                    hotelId: string;
                    message: string;
                    type?: string;
                },
                callback?: (response: any) => void
            ) => {
                try {
                    const { hotelId, message, type = "text" } = data;
                    const roomName = `hotel_${hotelId}`;

                    // Verify user is in the room
                    if (!socket.rooms.has(roomName)) {
                        if (callback) {
                            callback({
                                success: false,
                                error: "You must join the hotel first",
                            });
                        }
                        return;
                    }

                    // Broadcast to all users in the hotel room except sender
                    socket.to(roomName).emit("message", {
                        userId,
                        userEmail,
                        message,
                        type,
                        timestamp: new Date(),
                        socketId: socket.id,
                    });

                    console.log(`💬 Message from ${userId} in ${roomName}`);

                    if (callback) {
                        callback({
                            success: true,
                            message: "Message sent"
                        });
                    }
                } catch (error) {
                    console.error("Error sending message:", error);
                    if (callback) {
                        callback({
                            success: false,
                            error: "Failed to send message",
                        });
                    }
                }
            }
        );
    }

    /**
     * Handle get_hotel_users event
     */
    private handleGetHotelUsers(io: Server, socket: Socket): void {
        socket.on(
            "get_hotel_users",
            async (hotelId: string, callback?: (response: any) => void) => {
                try {
                    const roomName = `hotel_${hotelId}`;
                    const room = io.sockets.adapter.rooms.get(roomName);

                    if (!room) {
                        if (callback) {
                            callback({
                                success: true,
                                users: [],
                                count: 0
                            });
                        }
                        return;
                    }

                    const socketIds = Array.from(room);
                    const users = await Promise.all(
                        socketIds.map(async (socketId) => {
                            const socket = io.sockets.sockets.get(socketId);
                            return socket
                                ? {
                                    socketId,
                                    userId: socket.data.userId,
                                    email: socket.data.userEmail,
                                }
                                : null;
                        })
                    );

                    const filteredUsers = users.filter((user) => user !== null);

                    if (callback) {
                        callback({
                            success: true,
                            users: filteredUsers,
                            count: filteredUsers.length,
                        });
                    }
                } catch (error) {
                    console.error("Error getting hotel users:", error);
                    if (callback) {
                        callback({
                            success: false,
                            error: "Failed to get users",
                        });
                    }
                }
            }
        );
    }

    /**
     * Handle disconnect event
     */
    private handleDisconnect(socket: Socket, userId: number): void {
        socket.on("disconnect", (reason) => {
            console.log(`❌ User ${userId} disconnected:`, {
                reason,
                socketId: socket.id,
                timestamp: new Date().toISOString(),
            });

            // Notify all rooms this user was in
            socket.rooms.forEach((room) => {
                // Skip the socket's own room (socket.id)
                if (room !== socket.id) {
                    socket.to(room).emit("user_disconnected", {
                        userId,
                        socketId: socket.id,
                        timestamp: new Date(),
                    });
                }
            });
        });
    }

    /**
     * Handle error event
     */
    private handleError(socket: Socket, userId: number): void {
        socket.on("error", (error) => {
            console.error(`⚠️ Socket error for user ${userId}:`, error);
        });
    }
}

// Export class and singleton instance
export const socketHandlers = new SocketHandlers();