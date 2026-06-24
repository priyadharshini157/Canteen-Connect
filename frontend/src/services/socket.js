class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = [];
        this.reconnectTimeout = null;
        this.intentionalDisconnect = false;
        
        // Fallback to localhost if the env variable is missing
        this.wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/tokens";
    }

    connect() {
        this.intentionalDisconnect = false;

        // Prevent opening multiple connections
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.socket = new WebSocket(this.wsUrl);

        this.socket.onopen = () => {
            console.log("WebSocket connected successfully.");
            // Clear any pending reconnection timers once connected
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.listeners.forEach(callback => callback(data));
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket encountered an error:", error);
            // We don't necessarily need to reconnect here; onclose will fire next
        };

        this.socket.onclose = (event) => {
            if (this.intentionalDisconnect) {
                console.log("WebSocket disconnected intentionally.");
                return;
            }
            
            console.log(`WebSocket closed (Code: ${event.code}). Reconnecting in 3s...`);
            
            // Ensure we don't stack multiple timeouts
            if (!this.reconnectTimeout) {
                this.reconnectTimeout = setTimeout(() => {
                    this.reconnectTimeout = null;
                    this.connect();
                }, 3000);
            }
        };
    }

    // Call this when the user logs out or leaves the specific feature
    disconnect() {
        this.intentionalDisconnect = true;
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        
        // Return an unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }
}

export const socketService = new SocketService();