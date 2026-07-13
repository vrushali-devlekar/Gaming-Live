/**
 * Real-time Squad Sync TypeScript Service
 * Manages WebSocket lifecycle, payload formats, and reconnection protocol.
 */

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

export interface CursorPosition {
  line: number;
  ch: number;
}

export interface SquadMember {
  userId: string;
  name: string;
  color: string;
  cursor: CursorPosition;
  hp: number;
  testsPassed: number;
}

export interface JoinPayload {
  roomId: string;
  userId: string;
  name: string;
  color: string;
}

export interface CodePayload {
  userId: string;
  code: string;
}

export interface CursorPayload {
  userId: string;
  cursor: CursorPosition;
}

export interface SquadStatePayload {
  members: Record<string, SquadMember>;
}

export type SquadMessage =
  | { type: 'JOIN_ROOM'; payload: JoinPayload }
  | { type: 'CODE_UPDATE'; payload: CodePayload }
  | { type: 'CURSOR_UPDATE'; payload: CursorPayload }
  | { type: 'SQUAD_STATE_CHANGE'; payload: SquadStatePayload }
  | { type: 'ROOM_FULL'; payload: { message: string } };

export class SquadSyncService {
  private socket: WebSocket | null = null;
  private url: string;
  private roomId: string;
  private userId: string;
  private userName: string;
  private userColor: string;
  
  private onStatusChange: (status: ConnectionStatus) => void;
  private onMessageReceived: (message: SquadMessage) => void;
  
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 6;
  private reconnectDelay = 1000; // Starting delay (1s)
  private isIntentionalDisconnect = false;

  constructor(
    wsUrl: string,
    roomId: string,
    userId: string,
    userName: string,
    userColor: string,
    onStatusChange: (status: ConnectionStatus) => void,
    onMessageReceived: (message: SquadMessage) => void
  ) {
    this.url = wsUrl;
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    this.userColor = userColor;
    this.onStatusChange = onStatusChange;
    this.onMessageReceived = onMessageReceived;
  }

  /**
   * Establish connection to the native WebSocket server.
   */
  public connect(): void {
    this.isIntentionalDisconnect = false;
    this.onStatusChange(this.reconnectAttempts > 0 ? 'RECONNECTING' : 'CONNECTING');
    
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WS: Socket connection established successfully.');
        this.onStatusChange('CONNECTED');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        // Handshake: Join room immediately upon connecting
        this.joinRoom();
      };

      this.socket.onmessage = (event) => {
        try {
          const rawMessage = JSON.parse(event.data) as SquadMessage;
          this.onMessageReceived(rawMessage);
        } catch (err) {
          console.error('WS: Failed to parse incoming packet data.', err);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WS: Socket error encountered:', error);
      };

      this.socket.onclose = (event) => {
        console.log(`WS: Connection closed. Code: ${event.code}. Reason: ${event.reason}`);
        this.socket = null;

        if (!this.isIntentionalDisconnect) {
          this.onStatusChange('DISCONNECTED');
          this.attemptReconnection();
        }
      };
    } catch (e) {
      console.error('WS: Failed to instantiate WebSocket:', e);
      this.attemptReconnection();
    }
  }

  /**
   * Reconnection with exponential backoff.
   */
  private attemptReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WS: Maximum reconnection attempts reached. Halting client synchronization.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`WS: Attempting reconnection #${this.reconnectAttempts} in ${delay}ms...`);
    
    this.onStatusChange('RECONNECTING');

    setTimeout(() => {
      if (!this.isIntentionalDisconnect && !this.socket) {
        this.connect();
      }
    }, delay);
  }

  /**
   * Send the initial join room details packet.
   */
  private joinRoom(): void {
    this.send({
      type: 'JOIN_ROOM',
      payload: {
        roomId: this.roomId,
        userId: this.userId,
        name: this.userName,
        color: this.userColor
      }
    });
  }

  /**
   * Broadcast code change event payload.
   */
  public broadcastCodeUpdate(code: string): void {
    this.send({
      type: 'CODE_UPDATE',
      payload: {
        userId: this.userId,
        code
      }
    });
  }

  /**
   * Broadcast local cursor moves.
   */
  public broadcastCursorMove(line: number, ch: number): void {
    this.send({
      type: 'CURSOR_UPDATE',
      payload: {
        userId: this.userId,
        cursor: { line, ch }
      }
    });
  }

  /**
   * Send a parsed JSON object down the socket stream.
   */
  private send(message: Object): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WS: Cannot send message packet. Socket is currently closed or offline.');
    }
  }

  /**
   * Disconnect socket cleanly on unmount.
   */
  public disconnect(): void {
    this.isIntentionalDisconnect = true;
    if (this.socket) {
      this.socket.close(1000, 'Intentional cleanup disconnect.');
      this.socket = null;
    }
    this.onStatusChange('DISCONNECTED');
  }
}
