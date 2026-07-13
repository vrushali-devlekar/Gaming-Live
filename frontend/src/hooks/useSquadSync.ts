import { useState, useEffect, useRef, useCallback } from 'react';
import { SquadSyncService, ConnectionStatus, SquadMember, SquadMessage } from '../services/SquadSyncService';

interface UseSquadSyncProps {
  wsUrl: string;
  roomId: string;
  userId: string;
  userName: string;
  userColor?: string;
  initialCode?: string;
}

export function useSquadSync({
  wsUrl,
  roomId,
  userId,
  userName,
  userColor = '#FACC15',
  initialCode = ''
}: UseSquadSyncProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [squadMembers, setSquadMembers] = useState<Record<string, SquadMember>>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED');

  const serviceRef = useRef<SquadSyncService | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Message handler to sync socket events into React state
  const handleIncomingMessage = useCallback((message: SquadMessage) => {
    const { type, payload } = message;

    switch (type) {
      case 'CODE_UPDATE': {
        const { userId: senderId, code: updatedCode } = payload;
        // Apply remote changes only if not originating from local user
        if (senderId !== userId) {
          setCode(updatedCode);
        }
        break;
      }

      case 'CURSOR_UPDATE': {
        const { userId: senderId, cursor } = payload;
        if (senderId !== userId) {
          setSquadMembers((prev) => {
            if (!prev[senderId]) return prev;
            return {
              ...prev,
              [senderId]: {
                ...prev[senderId],
                cursor
              }
            };
          });
        }
        break;
      }

      case 'SQUAD_STATE_CHANGE': {
        const { members } = payload;
        setSquadMembers(members);
        break;
      }

      case 'ROOM_FULL': {
        console.warn('WS: Failed to join. Room is full.', payload.message);
        break;
      }

      default:
        break;
    }
  }, [userId]);

  // Handle socket lifecycle connection on load and cleanup on unmount
  useEffect(() => {
    const service = new SquadSyncService(
      wsUrl,
      roomId,
      userId,
      userName,
      userColor,
      setConnectionStatus,
      handleIncomingMessage
    );

    serviceRef.current = service;
    service.connect();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      service.disconnect();
      serviceRef.current = null;
    };
  }, [wsUrl, roomId, userId, userName, userColor, handleIncomingMessage]);

  // Debounced code broadcast method to avoid network flooding
  const broadcastCodeChange = useCallback((newCode: string) => {
    // 1. Update local UI state immediately
    setCode(newCode);

    // 2. Debounce WS packet transmission (300ms window)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (serviceRef.current) {
        serviceRef.current.broadcastCodeUpdate(newCode);
      }
    }, 300);
  }, []);

  // Cursor move broadcast method
  const broadcastCursorMove = useCallback((line: number, ch: number) => {
    if (serviceRef.current) {
      serviceRef.current.broadcastCursorMove(line, ch);
    }
  }, []);

  return {
    code,
    squadMembers,
    connectionStatus,
    broadcastCodeChange,
    broadcastCursorMove
  };
}
export type UseSquadSyncReturn = ReturnType<typeof useSquadSync>;
export type { ConnectionStatus, SquadMember, CursorPosition };
