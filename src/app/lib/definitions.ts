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
