/** This file contains all type definition in the project */
export interface User {
  id: string;
  username: string;
  password: string;
  is_online: boolean;
  friends_count: number;
  status: string;
  profile_img: string | null;
  additional_info: JSON | null;
}

export interface UserSession {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface Friend {
  id: string;
  user_id_1: string;
  user_id_2: string;
}

export interface FriendData {
  id: string;
  username: string;
}

export interface FriendRequest {
  id: string;
  from_id: string;
  to_id: string;
}

export interface FriendRequestInfo extends FriendRequest {
  requester: string;
}

export interface ChatRoom {
  id: string;
  type: string;
  user_id_1: string;
  user_id_2: string;
  last_message: string; // this last message is not the raw text msg, but the message id
}

export interface Message {
  id: string;
  chatroom_id: string;
  creator_id: string;
  creator_username: string;
  text: string;
  timestamp: Date;
  type: string;
}

export interface GroupMessage extends Message {}

export interface OpenChatRoomResponse {
  id: string;
  receiver: User | undefined;
  messages: { [key: string]: Message[] };
  error: string;
}

export interface GetChatRoomsResponse {
  chatRooms: ChatRoom[];
  error: string;
}

export interface GetChatCardDataResponse {
  receiverId: string;
  receiverUsername: string;
  lastUsername: string;
  lastMessageTxt: string;
  timestamp: Date | undefined;
  error: string;
}

export interface AlertState {
  type: 'success' | 'failure';
  message: string;
  show: boolean;
}

export interface Group {
  id: string;
  group_slug: string;
  leader: string;
  group_name: string;
  last_message: string | null;
}

export interface OpenGroupRoomResponse {
  group: Group;
  messages: { [key: string]: GroupMessage[] };
  totalMember: number;
  error: string;
}
