import { Server, Socket } from 'socket.io';

export const registerSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        const userId = socket.data.userId;
        const userEmail = socket.data.userEmail;

        /**
         * Join a hotel room id (with authorization check)
         */
        socket.on('join_hotel', async (hotelId: string, callback?: (response: any) => void) => {
            try {
                // Join the room
                socket.join(hotelId);

                console.log(`🏨 User ${userId} joined ${hotelId}`);

                // Notify others in the room
                socket.to(hotelId).emit('user_joined', {
                    userId,
                    socketId: socket.id,
                    timestamp: new Date()
                });

                // Send success response
                if (callback) {
                    callback({
                        success: true,
                        message: `Joined hotel ${hotelId}`
                    });
                }
            } catch (error) {
                console.error('Error joining hotel:', error);
                if (callback) {
                    callback({
                        success: false,
                        error: 'Failed to join hotel'
                    });
                }
            }
        });

        /**
         * Leave a hotel room
         */
        socket.on('leave_hotel', (hotelId: string, callback?: (response: any) => void) => {
            socket.leave(`hotel_${hotelId}`);

            console.log(`🚪 User ${userId} left hotel ${hotelId}`);

            socket.to(`hotel_${hotelId}`).emit('user_left', {
                userId,
                socketId: socket.id,
                timestamp: new Date()
            });

            if (callback) {
                callback({ success: true, message: `Left hotel ${hotelId}` });
            }
        });

        /**
         * Send a message to a room
         */
        socket.on('send_message', async (data: {
            hotelId: string;
            message: string;
            type?: string;
        }, callback?: (response: any) => void) => {
            try {
                const { hotelId, message, type = 'text' } = data;

                // Verify user is in the room
                const rooms = Array.from(socket.rooms);
                if (!rooms.includes(`hotel_${hotelId}`)) {
                    if (callback) {
                        callback({
                            success: false,
                            error: 'You must join the hotel first'
                        });
                    }
                    return;
                }

                // Broadcast to all users in the hotel room except sender
                socket.to(`hotel_${hotelId}`).emit('message', {
                    userId,
                    userEmail,
                    message,
                    type,
                    timestamp: new Date(),
                    socketId: socket.id
                });

                console.log(`💬 Message from ${userId} in hotel ${hotelId}`);

                if (callback) {
                    callback({ success: true, message: 'Message sent' });
                }
            } catch (error) {
                console.error('Error sending message:', error);
                if (callback) {
                    callback({
                        success: false,
                        error: 'Failed to send message'
                    });
                }
            }
        });

        /**
         * Get list of users in a room
         */
        socket.on('get_hotel_users', async (hotelId: string, callback?: (response: any) => void) => {
            try {
                const room = io.sockets.adapter.rooms.get(`hotel_${hotelId}`);

                if (!room) {
                    if (callback) {
                        callback({ success: true, users: [] });
                    }
                    return;
                }

                const socketIds = Array.from(room);
                const users = await Promise.all(
                    socketIds.map(async (socketId) => {
                        const socket = io.sockets.sockets.get(socketId);
                        return socket ? {
                            socketId,
                            userId: socket.data.userId,
                            email: socket.data.userEmail
                        } : null;
                    })
                );

                const filteredUsers = users.filter(user => user !== null);

                if (callback) {
                    callback({
                        success: true,
                        users: filteredUsers,
                        count: filteredUsers.length
                    });
                }
            } catch (error) {
                console.error('Error getting hotel users:', error);
                if (callback) {
                    callback({
                        success: false,
                        error: 'Failed to get users'
                    });
                }
            }
        });

        /**
         * Handle disconnect
         */
        socket.on('disconnect', (reason) => {
            console.log(`❌ User ${userId} disconnected:`, {
                reason,
                socketId: socket.id,
                timestamp: new Date().toISOString()
            });

            // Notify all rooms this user was in
            const rooms = Array.from(socket.rooms);
            rooms.forEach(room => {
                if (room !== socket.id) {
                    socket.to(room).emit('user_disconnected', {
                        userId,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                }
            });
        });

        /**
         * Handle errors
         */
        socket.on('error', (error) => {
            console.error(`⚠️ Socket error for user ${userId}:`, error);
        });
    });
};