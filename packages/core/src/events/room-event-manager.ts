import { getRandomId } from '../utils';
import { WssResponse } from '../dtos';
import { Room } from '../models';
import RoomRepository from '../../../core/src/repositories/room-repository';

const roomEventActions = ['create', 'join', 'leave', 'updateProfile'] as const;

export type RoomEventAction = (typeof roomEventActions)[number];

export class RoomEventManager {
  static async createRoom(playerId: string, playerName: string): Promise<WssResponse> {
    const room = new Room({
      id: getRandomId().toString(),
      hostName: playerName
    });
    room.newClientJoined(playerId, playerName);
    RoomRepository.createRoom(room);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: playerName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'private'
    };
  }

  static async joinRoom(
    roomId: string,
    playerId: string,
    playerName: string
  ): Promise<WssResponse> {
    const room = await RoomRepository.getRoom(roomId);
    if (room.clients.length > 8) throw new Error('Maximum length of players in room');

    room.newClientJoined(playerId, playerName);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'broadcast'
    };
  }

  static async leaveRoom(roomId: string, playerId: string): Promise<WssResponse> {
    const room = await RoomRepository.getRoom(roomId);
    room.removeClient(playerId);
    if (!room) return;

    if (room.clients.length === 0) RoomRepository.getRoom(room.id);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      communicationType: 'broadcast'
    };
  }

  static async updateProfile(roomId: string, playerId: string): Promise<WssResponse> {
    const room = await RoomRepository.getRoom(roomId);
    const profile = room.getNewRandomProfile();
    room.setClientProfile(playerId, profile);
    return {
      responseType: 'room',
      roomId: room.id,
      hostName: room.hostName,
      clients: room.clients,
      message: '{}',
      status: 'INROOM',
      communicationType: 'broadcast'
    };
  }

  static async getResponse(eventName: RoomEventAction, payload?: any): Promise<WssResponse> {
    switch (eventName) {
      case 'create':
        return await this.createRoom(payload.playerId, payload.playerName);
      case 'join':
        return await this.joinRoom(payload.roomId, payload.playerId, payload.playerName);
      case 'leave':
        return await this.leaveRoom(payload.roomId, payload.playerId);
      case 'updateProfile':
        return await this.updateProfile(payload.roomId, payload.playerId);
    }
  }
}
