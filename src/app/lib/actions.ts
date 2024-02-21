/** This file contains the controller which will be consumed by the client */
'use server';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';
import {
  ChatRoom,
  Friend,
  FriendData,
  FriendRequest,
  FriendRequestInfo,
  GetChatCardDataResponse,
  GetChatRoomsResponse,
  Message,
  OpenChatRoomResponse,
  User,
} from './definitions';
import { strict } from 'assert';
import { getUserSession } from './helpers';

dotenv.config();

// loginAction() receives prevState from useFormState()
export async function loginAction(formData: FormData) {
  // TODO: add validation
  try {
    // authenticate user
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const data =
      await sql<User>`SELECT * FROM users WHERE username=${username}`;
    const user = data.rows[0];

    if (!user) {
      return null;
    }

    // password comparison
    const passwordMatch = await bcrypt.compare(password!, user.password);
    if (!passwordMatch) {
      return null;
    }

    // store the basic user info in jwt
    const userObj = {
      userId: user.id,
      username: user.username,
    };

    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(userObj, secret, { expiresIn: '1d' });

    // store token in cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400, // for 1 day
    });

    cookies().set('auth_token', cookie);

    return userObj;
  } catch (error) {
    console.error('Login failed: ', error);
    return null;
  }
}

export async function logoutAction() {
  cookies().delete('auth_token');
}

export async function registerAction(formData: FormData) {
  // TODO: add validation

  const result = {
    user: undefined,
    error: '',
  };

  const username = formData.get('username')?.toString();

  // check whether username is registered
  const usernameExist =
    (await sql<User>`SELECT * FROM users WHERE username=${username}`)
      .rowCount !== 0;
  if (usernameExist) {
    result.error = 'username is already registered.';
    return result;
  }

  // check whether password match
  const password = formData.get('password')?.toString();
  const rePassword = formData.get('repassword')?.toString();
  const passwordMatch = password === rePassword;
  if (!passwordMatch) {
    result.error = 'password does not match.';
    return result;
  }

  // hash password
  const salt = await bcrypt.genSalt(16);
  const hashedPassword = await bcrypt.hash(password!, salt);

  // register to db
  const data =
    await sql<User>`INSERT INTO users(username, password) VALUES (${username}, ${hashedPassword});`;
  console.log(data);

  return;
}

export async function getUser() {
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await sql<User>`SELECT * FROM users WHERE id=${userId}`;
    const userData = data.rows[0];
    if (!userData) {
      return null;
    }

    // Exclude the password
    const user = {
      ...userData,
      password: '',
    };

    return user;
  } catch (error) {
    console.error('Fetching user failed', error);
    return null;
  }
}

export async function updateUsername(userId: string, newUsername: string) {
  const result: {
    success: boolean;
    error: string;
  } = {
    success: false,
    error: '',
  };
  try {
    const data = await sql<User>`SELECT * FROM users WHERE id=${userId}`;
    const user = data.rows[0];

    if (!user) {
      result.error = 'Invalid user id.';
      return result;
    }

    if (user.username === newUsername) {
      // username cannot be the same as the current
      result.error = 'New username cannot be the same as current username.';
      return result;
    }

    const userQuery =
      await sql<User>`SELECT * FROM users WHERE username=${newUsername}`;
    const usernameExist = userQuery.rows[0];
    if (usernameExist) {
      result.error = 'Username already exist!';
      return result;
    }

    const updateQuery =
      await sql<User>`UPDATE users SET username=${newUsername} WHERE id=${userId}`;

    const updateStatus = updateQuery.rowCount > 0 ? true : false;
    result.success = updateStatus;
    return result;
  } catch (error) {
    console.error('Update username failed: ', error);
    result.error = 'Update username failed.';
    return result;
  }
}

export async function updateUserStatus(userId: string, newStatus: string) {
  const result: {
    success: boolean;
    error: string;
  } = {
    success: false,
    error: '',
  };
  try {
    const data = await sql<User>`SELECT * FROM users WHERE id=${userId}`;
    const user = data.rows[0];

    if (!user) {
      result.error = 'Invalid user id.';
      return result;
    }

    const updateQuery =
      await sql<User>`UPDATE users SET status=${newStatus} WHERE id=${userId}`;

    const updateStatus = updateQuery.rowCount > 0 ? true : false;
    result.success = updateStatus;
    return result;
  } catch (error) {
    console.error('Update status failed: ', error);
    result.error = 'Update status failed.';
    return result;
  }
}

export async function getAllUserFriends() {
  const result = {
    error: '',
    friends: [] as FriendData[],
  };
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data =
      await sql<Friend>`SELECT * FROM friends WHERE user_id_1=${userId} OR user_id_2=${userId}`;
    const friendsData = data.rows;

    // construct friends array to be consumed by the client
    const friendsArr: FriendData[] = [];
    for (const friend of friendsData) {
      const userIs1 = friend.user_id_1 === userId;
      let friendInfo;
      if (userIs1) {
        // fetch the info of the friend i.e. the second user id
        const user2Data =
          await sql<FriendData>`SELECT id, username FROM users WHERE id=${friend.user_id_2}`;
        friendInfo = user2Data.rows[0];
      } else {
        // otherwise, fetch the info of the friend i.e. the first user id
        const user1Data =
          await sql<FriendData>`SELECT id, username FROM users WHERE id=${friend.user_id_1}`;
        friendInfo = user1Data.rows[0];
      }

      // add to friendsArr
      friendsArr.push(friendInfo);
    }

    result.friends = friendsArr;
    return result;
  } catch (error) {
    console.log('Error while fetching friends: ', error);
    result.error = 'Fail to fetch friends.';
    return result;
  }
}

export async function findUsername(username: string) {
  const result = {
    users: [] as User[],
    error: '',
  };
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await sql<User>`SELECT * FROM users`;
    const queriedUsers = data.rows;

    // had to do this due to % wildcard error. This would work but potentially leads to performance issue.
    const filteredUser = queriedUsers.filter(
      (user) => user.username.includes(username) && user.id != userId
    );

    result.users = filteredUser;
    return result;
  } catch (error) {
    console.error('Error searching user by username: ', error);
    result.error = 'Fail to search user.';
    return result;
  }
}

export async function addFriend(targetUserId: string) {
  const result = {
    success: false,
    error: '',
  };

  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    // check whether the target user is already become friend
    const isFriendCheck = await checkIsFriend(targetUserId);
    if (isFriendCheck.isFriend) {
      result.error = 'User has already in friend list.';
      return result;
    }

    // add to friend_request table, wait for acceptance
    await sql`INSERT INTO friend_requests(from_id, to_id) VALUES (${userId}, ${targetUserId})`;
    result.success = true;
  } catch (error) {
    console.error('Error adding friend: ', error);
    result.error = 'Fail to add friend.';
  } finally {
    return result;
  }
}

export async function checkIsFriend(targetUserId: string) {
  const result = {
    isFriend: false,
    error: '',
  };

  try {
    // get current user's friend
    const usersFriend = await getAllUserFriends();
    const isInFriend = usersFriend.friends.find(
      (friend) => friend.id === targetUserId
    );
    if (isInFriend) {
      result.isFriend = true;
    } else {
      result.isFriend = false;
    }

    return result;
  } catch (error) {
    console.error('Error checking friend: ', error);
    result.error = 'Fail to check friend.';
  } finally {
    return result;
  }
}

export async function getAllUserFriendRequests() {
  const result = {
    friendRequests: [] as FriendRequestInfo[],
    error: '',
  };

  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await sql<FriendRequestInfo>`
        SELECT fr.id, from_id, to_id, username AS requester FROM friend_requests fr 
        INNER JOIN users u ON fr.from_id=u.id
        WHERE to_id=${userId}`;
    const friendRequests = data.rows;
    result.friendRequests = friendRequests;
  } catch (error) {
    console.error('Error while getting friend requests: ', error);
    result.error = 'Cannot get friend requests.';
  } finally {
    return result;
  }
}

export async function acceptFriendRequest(requesterId: string) {
  const result = {
    success: false,
    error: '',
  };

  try {
    // add requester to the current user's friend list
    const userSession = getUserSession();
    const userId = userSession?.userId;

    await sql`INSERT INTO friends(user_id_1, user_id_2) VALUES (${userId}, ${requesterId})`;

    // delete friend request for the requester-currentUser pair
    await sql`DELETE FROM friend_requests WHERE from_id=${requesterId} AND to_id=${userId}`;

    result.success = true;
  } catch (error) {
    console.error('Error while accepting friend request: ', error);
    result.error = 'Cannot accept friend request at the moment.';
  } finally {
    return result;
  }
}

export async function rejectFriendRequest(friendReqId: string) {
  const result = {
    success: false,
    error: '',
  };

  try {
    // delete friend request directly
    await sql`DELETE FROM friend_requests WHERE id=${friendReqId}`;
  } catch (error) {
    console.error('Error while rejecting friend request: ', error);
    result.error = 'Cannot reject friend request at the moment.';
  } finally {
    return result;
  }
}

export async function findChatRoom(
  currentUserId: string,
  targetUserId: string
) {
  try {
    const chatRoom =
      await sql<ChatRoom>`SELECT * FROM chatrooms WHERE (user_id_1=${currentUserId} AND user_id_2=${targetUserId}) OR (user_id_1=${targetUserId} AND user_id_2=${currentUserId})`;

    if (chatRoom.rowCount === 0) {
      return null;
    }

    return Promise.resolve(chatRoom.rows[0]);
  } catch (error) {
    console.error('Error while finding chat room', error);
    return null;
  }
}

// Return the receiver and messages
export async function openChatRoom(targetUserId: string) {
  const result: OpenChatRoomResponse = {
    id: '',
    receiver: undefined,
    messages: {},
    error: '',
  };

  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    // get the target user obj
    const targetUserQuery =
      await sql<User>`SELECT id, username, is_online FROM users WHERE id=${targetUserId}`;
    if (targetUserQuery.rowCount === 0) {
      result.error = 'No target user found.';
      return result;
    }
    const targetUser = targetUserQuery.rows[0];
    result.receiver = targetUser;

    // find the existing chat room
    let chatRoom = await findChatRoom(userId!, targetUserId);

    // if no chatroom is found, add a new one and pass an empty array of messages
    if (!chatRoom) {
      await sql`INSERT INTO chatrooms(type, user_id_1, user_id_2) VALUES ('personal', ${userId}, ${targetUserId})`;

      chatRoom = await findChatRoom(userId!, targetUserId);
      result.id = chatRoom?.id!;

      return result;
    }

    // if there is a chatroom found, then fetch all the messages and pass to the result
    result.id = chatRoom.id;
    const messagesQuery =
      await sql<Message>`SELECT * FROM messages WHERE chatroom_id=${chatRoom.id} ORDER BY timestamp`;

    // modify the data to be divided by date
    const messages = messagesQuery.rows;
    // message will be grouped by date
    const groupedMessages: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp);
      const groupKey = `${messageDate.getFullYear()}/${
        messageDate.getMonth() + 1
      }/${messageDate.getDate()}`;

      // if the date is in the group message, just add to that array, otherwise make a new one
      if (groupedMessages.hasOwnProperty(groupKey)) {
        groupedMessages[groupKey].push(message);
      } else {
        groupedMessages[groupKey] = [message];
      }
    });
    result.messages = groupedMessages;

    return result;
  } catch (error) {
    console.error('Error while opening chat room: ', error);
    result.error = 'Cannot open the chat room at the moment.';
    return result;
  }
}

export async function sendMessage(
  chatroomId: string,
  creatorUsername: string,
  text: string
) {
  const result = {
    success: false,
    error: '',
  };
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    await sql`INSERT INTO messages(chatroom_id, creator_id, creator_username, text) VALUES (${chatroomId}, ${userId}, ${creatorUsername}, ${text})`;
    // grab the newly inserted data ID
    const topMessage = (
      await sql<Message>`SELECT * FROM messages WHERE chatroom_id=${chatroomId} ORDER BY timestamp DESC`
    ).rows[0];

    // record the topmost messsage to the chatrooms table
    await sql`UPDATE chatrooms SET last_message=${topMessage.id} WHERE id=${chatroomId}`;

    result.success = true;
  } catch (error) {
    console.error('Error while sending message', error);
    result.error = 'Fail to send message!';
  } finally {
    return result;
  }
}

export async function getChatRooms() {
  const result: GetChatRoomsResponse = {
    chatRooms: [],
    error: '',
  };
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    const chatRooms = (
      await sql<ChatRoom>`SELECT * FROM chatrooms WHERE user_id_1=${userId} OR user_id_2=${userId}`
    ).rows;
    result.chatRooms = chatRooms;
  } catch (error) {
    console.error('Error while getting chat rooms: ', error);
    result.error = 'Cannot get chatrooms at the moment.';
  } finally {
    return result;
  }
}

export async function getChatCardData(chatRoomData: ChatRoom) {
  const result: GetChatCardDataResponse = {
    receiverId: '',
    receiverUsername: '',
    lastUsername: '',
    lastMessageTxt: '',
    timestamp: undefined,
    error: '',
  };

  try {
    const user = await getUser();
    const userId = user?.id;

    // fetch the receiver info
    let receiverId =
      chatRoomData.user_id_1 === userId
        ? chatRoomData.user_id_2
        : chatRoomData.user_id_1;
    const receiver = (
      await sql<User>`SELECT * FROM users WHERE id=${receiverId}`
    ).rows[0];
    result.receiverUsername = receiver.username;
    result.receiverId = receiver.id;

    const lastMsg = (
      await sql<Message>`SELECT * FROM messages WHERE id=${chatRoomData.last_message}`
    ).rows[0];
    result.lastUsername = lastMsg.creator_username;
    result.lastMessageTxt = lastMsg.text;
    result.timestamp = lastMsg.timestamp;
  } catch (error) {
    console.error('Error while getting chat card data: ', error);
    result.error = 'Cannot get chat card data at the moment.';
  } finally {
    return result;
  }
}
