/** This file contains the controller which will be consumed by the client */
'use server';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import dotenv from 'dotenv';
import {
  ChatRoom,
  FriendData,
  FriendRequestInfo,
  GetChatCardDataResponse,
  GetChatRoomsResponse,
  Group,
  GroupPoll,
  Message,
  OpenChatRoomResponse,
  User,
} from './definitions';
import { getUserSession } from './helpers';
import connectDB from './db';
import { unstable_noStore } from 'next/cache';
import { customAlphabet } from 'nanoid';

dotenv.config();

// loginAction() receives prevState from useFormState()
export async function loginAction(formData: FormData) {
  unstable_noStore();
  // TODO: add validation
  // init db client
  const { client, endPool } = await connectDB();
  try {
    // authenticate user
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const data = await client.query('SELECT * FROM users WHERE username=$1', [
      username,
    ]);

    if (data.rowCount === 0) {
      return null;
    }
    const user: User = data.rows[0];

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
  } finally {
    client.release();
    endPool();
  }
}

export async function logoutAction() {
  unstable_noStore();

  cookies().delete('auth_token');
}

export async function registerAction(formData: FormData) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };

  const username = formData.get('username')?.toString();
  const { client, endPool } = await connectDB();
  try {
    // check whether username is registered
    const usernameExist =
      (await client.query('SELECT * FROM users WHERE username=$1', [username]))
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
      result.error = 'Password does not match.';
      return result;
    }

    // hash password
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password!, salt);

    // register to db
    await client.query(
      'INSERT INTO users(username, password) VALUES ($1, $2);',
      [username, hashedPassword]
    );
    result.success = true;
  } catch (error) {
    console.error('Error while registering new user: ', error);
    result.error = 'Fail to register new user.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function getUser() {
  unstable_noStore();

  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await client.query('SELECT * FROM users WHERE id=$1', [
      userId,
    ]);
    const userData: User = data.rows[0];
    if (!userData) {
      return null;
    }

    // Exclude the password
    const user = {
      ...userData,
      password: '',
    };

    client.release();
    endPool();

    return user;
  } catch (error) {
    console.error('Fetching user failed', error);
    client.release();
    endPool();
    return null;
  }
}

export async function updateUsername(userId: string, newUsername: string) {
  unstable_noStore();

  const result: {
    success: boolean;
    error: string;
  } = {
    success: false,
    error: '',
  };
  const { client, endPool } = await connectDB();
  try {
    const data = await client.query('SELECT * FROM users WHERE id=$1', [
      userId,
    ]);
    const user: User = data.rows[0];

    if (!user) {
      result.error = 'Invalid user id.';
      return result;
    }

    if (user.username === newUsername) {
      // username cannot be the same as the current
      result.error = 'New username cannot be the same as current username.';
      return result;
    }

    const userQuery = await client.query(
      'SELECT * FROM users WHERE username=$1',
      [newUsername]
    );
    const usernameExist = userQuery.rows[0];
    if (usernameExist) {
      result.error = 'Username already exist!';
      return result;
    }

    const updateQuery = await client.query(
      'UPDATE users SET username=$1 WHERE id=$2',
      [newUsername, userId]
    );

    const updateStatus = updateQuery.rowCount > 0 ? true : false;
    result.success = updateStatus;
  } catch (error) {
    console.error('Update username failed: ', error);
    result.error = 'Update username failed.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function updateUserStatus(userId: string, newStatus: string) {
  unstable_noStore();

  const result: {
    success: boolean;
    error: string;
  } = {
    success: false,
    error: '',
  };
  const { client, endPool } = await connectDB();
  try {
    const data = await client.query('SELECT * FROM users WHERE id=$1', [
      userId,
    ]);
    const user = data.rows[0];

    if (!user) {
      result.error = 'Invalid user id.';
      return result;
    }

    const updateQuery = await client.query(
      'UPDATE users SET status=$1 WHERE id=$2',
      [newStatus, userId]
    );

    const updateStatus = updateQuery.rowCount > 0 ? true : false;
    result.success = updateStatus;
  } catch (error) {
    console.error('Update status failed: ', error);
    result.error = 'Update status failed.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function getAllUserFriends() {
  unstable_noStore();

  const result = {
    error: '',
    friends: [] as FriendData[],
  };
  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await client.query(
      'SELECT * FROM friends WHERE user_id_1=$1 OR user_id_2=$1',
      [userId]
    );
    const friendsData = data.rows;

    // construct friends array to be consumed by the client
    const friendsArr: FriendData[] = [];
    for (const friend of friendsData) {
      const userIs1 = friend.user_id_1 === userId;
      let friendInfo;
      if (userIs1) {
        // fetch the info of the friend i.e. the second user id
        const user2Data = await client.query(
          'SELECT id, username FROM users WHERE id=$1',
          [friend.user_id_2]
        );
        friendInfo = user2Data.rows[0];
      } else {
        // otherwise, fetch the info of the friend i.e. the first user id
        const user1Data = await client.query(
          'SELECT id, username FROM users WHERE id=$1',
          [friend.user_id_1]
        );
        friendInfo = user1Data.rows[0];
      }

      // add to friendsArr
      friendsArr.push(friendInfo);
    }

    result.friends = friendsArr;
  } catch (error) {
    console.log('Error while fetching friends: ', error);
    result.error = 'Fail to fetch friends.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function findUsername(username: string) {
  unstable_noStore();

  const result = {
    users: [] as User[],
    error: '',
  };
  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    // const data = await client.query('SELECT * FROM users');
    // const queriedUsers = data.rows;

    // // had to do this due to % wildcard error. This would work but potentially leads to performance issue.
    // const filteredUser = queriedUsers.filter(
    //   (user) => user.username.includes(username) && user.id != userId
    // );
    const data = await client.query(
      `SELECT * FROM users WHERE username ILIKE '${username}%' AND id != '${userId}'`
    );

    result.users = data.rows;
  } catch (error) {
    console.error('Error searching user by username: ', error);
    result.error = 'Fail to search user.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function addFriend(targetUserId: string) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();
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
    await client.query(
      'INSERT INTO friend_requests(from_id, to_id) VALUES ($1, $2)',
      [userId, targetUserId]
    );
    result.success = true;
  } catch (error) {
    console.error('Error adding friend: ', error);
    result.error = 'Fail to add friend.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function checkIsFriend(targetUserId: string) {
  unstable_noStore();

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
  unstable_noStore();

  const result = {
    friendRequests: [] as FriendRequestInfo[],
    error: '',
  };

  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;
    const data = await client.query(
      `
        SELECT fr.id, from_id, to_id, username AS requester FROM friend_requests fr 
        INNER JOIN users u ON fr.from_id=u.id
        WHERE to_id=$1`,
      [userId]
    );
    const friendRequests: FriendRequestInfo[] = data.rows;
    result.friendRequests = friendRequests;
  } catch (error) {
    console.error('Error while getting friend requests: ', error);
    result.error = 'Cannot get friend requests.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function acceptFriendRequest(requesterId: string) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();
  try {
    // add requester to the current user's friend list
    const userSession = getUserSession();
    const userId = userSession?.userId;

    await client.query(
      'INSERT INTO friends(user_id_1, user_id_2) VALUES ($1, $2)',
      [userId, requesterId]
    );

    // delete friend request for the requester-currentUser pair
    await client.query(
      'DELETE FROM friend_requests WHERE from_id=$1 AND to_id=$2',
      [requesterId, userId]
    );

    result.success = true;
  } catch (error) {
    console.error('Error while accepting friend request: ', error);
    result.error = 'Cannot accept friend request at the moment.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function rejectFriendRequest(friendReqId: string) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();
  try {
    // delete friend request directly
    await client.query('DELETE FROM friend_requests WHERE id=$1', [
      friendReqId,
    ]);
  } catch (error) {
    console.error('Error while rejecting friend request: ', error);
    result.error = 'Cannot reject friend request at the moment.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function findChatRoom(
  currentUserId: string,
  targetUserId: string
) {
  unstable_noStore();

  const { client, endPool } = await connectDB();
  try {
    const chatRoom = await client.query(
      `SELECT * FROM chatrooms WHERE (user_id_1=$1 AND user_id_2=$2) OR (user_id_1=$2 AND user_id_2=$1)`,
      [currentUserId, targetUserId]
    );

    if (chatRoom.rowCount === 0) {
      return null;
    }
    client.release();

    endPool();
    return Promise.resolve(chatRoom.rows[0]);
  } catch (error) {
    console.error('Error while finding chat room', error);
    client.release();

    endPool();
    return null;
  }
}

// Return the receiver and messages
export async function openChatRoom(targetUserId: string) {
  unstable_noStore();

  const result: OpenChatRoomResponse = {
    id: '',
    receiver: undefined,
    messages: {},
    error: '',
  };

  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    // get the target user obj
    const targetUserQuery = await client.query(
      'SELECT id, username, is_online FROM users WHERE id=$1',
      [targetUserId]
    );
    if (targetUserQuery.rowCount === 0) {
      result.error = 'No target user found.';
      return result;
    }
    const targetUser = targetUserQuery.rows[0];
    result.receiver = targetUser;

    // find the existing chat room
    let chatRoom: ChatRoom = await findChatRoom(userId!, targetUserId);

    // if no chatroom is found, add a new one and pass an empty array of messages
    if (!chatRoom) {
      await client.query(
        'INSERT INTO chatrooms(user_id_1, user_id_2) VALUES ($1, $2)',
        [userId, targetUserId]
      );

      chatRoom = await findChatRoom(userId!, targetUserId);
      result.id = chatRoom?.id!;

      return result;
    }

    // if there is a chatroom found, then fetch all the messages and pass to the result
    result.id = chatRoom.id;
    const messagesQuery = await client.query(
      'SELECT * FROM messages WHERE chatroom_id=$1 ORDER BY timestamp',
      [chatRoom.id]
    );

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
  } catch (error) {
    console.error('Error while opening chat room: ', error);
    result.error = 'Cannot open the chat room at the moment.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function sendMessage(
  chatroomId: string,
  creatorUsername: string,
  text: string
) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };
  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    await client.query(
      'INSERT INTO messages(chatroom_id, creator_id, creator_username, text) VALUES ($1, $2, $3, $4)',
      [chatroomId, userId, creatorUsername, text]
    );
    // grab the newly inserted data ID
    const topMessage: Message = (
      await client.query(
        'SELECT * FROM messages WHERE chatroom_id=$1 ORDER BY timestamp DESC',
        [chatroomId]
      )
    ).rows[0];

    // record the topmost messsage to the chatrooms table
    await client.query('UPDATE chatrooms SET last_message=$1 WHERE id=$2', [
      topMessage.id,
      chatroomId,
    ]);

    result.success = true;
  } catch (error) {
    console.error('Error while sending message', error);
    result.error = 'Fail to send message!';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function getChatRooms() {
  unstable_noStore();

  const result: GetChatRoomsResponse = {
    chatRooms: [],
    error: '',
  };
  const { client, endPool } = await connectDB();
  try {
    const userSession = getUserSession();
    const userId = userSession?.userId;

    const chatRooms = (
      await client.query(
        'SELECT * FROM chatrooms WHERE user_id_1=$1 OR user_id_2=$1',
        [userId]
      )
    ).rows;
    result.chatRooms = chatRooms;
  } catch (error) {
    console.error('Error while getting chat rooms: ', error);
    result.error = 'Cannot get chatrooms at the moment.';
  } finally {
    client.release();

    endPool();
    return result;
  }
}

export async function getChatCardData(chatRoomData: ChatRoom) {
  unstable_noStore();

  const result: GetChatCardDataResponse = {
    receiverId: '',
    receiverUsername: '',
    lastUsername: '',
    lastMessageTxt: '',
    timestamp: undefined,
    error: '',
  };

  const { client, endPool } = await connectDB();
  try {
    const user = await getUser();
    const userId = user?.id;

    // fetch the receiver info
    let receiverId =
      chatRoomData.user_id_1 === userId
        ? chatRoomData.user_id_2
        : chatRoomData.user_id_1;
    const receiver: User = (
      await client.query('SELECT * FROM users WHERE id=$1', [receiverId])
    ).rows[0];
    result.receiverUsername = receiver.username;
    result.receiverId = receiver.id;

    const lastMsg = (
      await client.query('SELECT * FROM messages WHERE id=$1', [
        chatRoomData.last_message,
      ])
    ).rows[0];
    result.lastUsername = lastMsg.creator_username;
    result.lastMessageTxt = lastMsg.text;
    result.timestamp = lastMsg.timestamp;
  } catch (error) {
    console.error('Error while getting chat card data: ', error);
    result.error = 'Cannot get chat card data at the moment.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function createGroup(leader: string, groupName: string) {
  unstable_noStore();

  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    // generate 6 chars unique slug for invitation purpose
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const groupSlug = customAlphabet(validChars, 6)();

    // insert new group to db -- note: 'leader' is the ID of the user that initiates the group creation
    const insertResult = await client.query(
      'INSERT INTO groups(group_slug, leader, group_name) VALUES($1, $2, $3) RETURNING id',
      [groupSlug, leader, groupName]
    );

    const newGroupId = insertResult.rows[0].id;

    // add the group leader to the group_members
    await client.query(
      'INSERT INTO group_members(group_id, user_id) VALUES ($1, $2)',
      [newGroupId, leader]
    );

    result.success = true;
  } catch (error) {
    console.error('Error while creating a group: ', error);
    result.error = 'Cannot create a group at the moment.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function getChatGroups() {
  const result = {
    groups: [] as Group[],
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;

    // get all groups that has the current user as member
    const userGroupQuery = await client.query(
      'SELECT group_id FROM group_members WHERE user_id=$1',
      [userId]
    );

    // structure: [ {group_id: '...' } , ...]
    const userGroupList = userGroupQuery.rows;

    // iterate over and get the group info from db
    for (const group of userGroupList) {
      const groupQuery = await client.query(
        'SELECT * FROM groups WHERE id=$1',
        [group.group_id]
      );
      const groupObj = groupQuery.rows[0];
      result.groups.push(groupObj);
    }
  } catch (error) {
    console.error('Error while getting user groups: ', error);
    result.error = 'Cannot get chat groups at the moment.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function openGroupRoom(groupId: string) {
  // things needed: group info in groups table, how many members
  const result = {
    group: {} as Group,
    messages: {},
    totalMember: 0,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;

    // getting group info
    const groupQuery = await client.query('SELECT * FROM groups WHERE id=$1', [
      groupId,
    ]);
    const groupData = groupQuery.rows[0];
    if (groupQuery.rowCount !== 0) result.group = groupData;

    // getting how many members in the group
    const memberQuery = await client.query(
      'SELECT * FROM group_members WHERE group_id=$1',
      [groupId]
    );
    const memberCount = memberQuery.rowCount;
    result.totalMember = memberCount;

    // Getting group messages
    const messagesQuery = await client.query(
      'SELECT * FROM group_messages WHERE chatroom_id=$1 ORDER BY timestamp',
      [groupId]
    );
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
  } catch (error) {
    console.error('Error while opening group room: ', error);
    result.error = 'Cannot get group room info!';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function joinGroup(groupSlug: string) {
  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;

    // trade groupSlug for groupId
    const groupQuery = await client.query(
      'SELECT id FROM groups WHERE group_slug=$1',
      [groupSlug]
    );

    // check whether group slug exist
    if (groupQuery.rowCount === 0) {
      result.error = 'Invalid group slug.';
      return result;
    }

    const groupId = groupQuery.rows[0].id;
    // check whether user is already in the group
    const memberQuery = await client.query(
      'SELECT * FROM group_members WHERE group_id=$1 AND user_id=$2',
      [groupId, userId]
    );
    const isJoined = memberQuery.rowCount > 0;
    if (isJoined) {
      result.error = 'Already in the group!';
      return result;
    }

    // insert record to group_members
    await client.query(
      'INSERT INTO group_members(group_id, user_id) VALUES ($1, $2)',
      [groupId, userId]
    );

    result.success = true;
  } catch (error) {
    console.error('Error while joining a group: ', error);
    result.error = 'Fail to join group.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

// move soon to server
export async function createPoll(title: string, groupId: string) {
  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;
    const creatorUsername = user?.username;

    // record to group_polls table
    await client.query(
      'INSERT INTO group_polls(group_id, title, creator_id, creator_username) VALUES ($1, $2, $3, $4)',
      [groupId, title, userId, creatorUsername]
    );

    // grab the newly inserted data ID
    const latestPoll = (
      await client.query(
        'SELECT id FROM group_polls WHERE group_id=$1 ORDER BY timestamp DESC',
        [groupId]
      )
    ).rows[0];

    // record the poll to the group_messages table
    await client.query(
      'INSERT INTO group_messages(chatroom_id, creator_id, creator_username, text, type) VALUES ($1, $2, $3, $4, $5)',
      [groupId, userId, creatorUsername, latestPoll.id, 'poll']
    );

    result.success = true;
  } catch (error) {
    console.error('Error while creating a poll: ', error);
    result.error = 'Fail to create a group poll.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function getPollInfo(pollId: string, groupId: string) {
  const result = {
    pollObj: {} as GroupPoll,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;
    const creatorUsername = user?.username;

    const pollQuery = await client.query(
      'SELECT * FROM group_polls WHERE id=$1 AND group_id=$2',
      [pollId, groupId]
    );
    const pollData = pollQuery.rows[0];

    // get the total respondent, agreeCount, and disagreeCount
    const totalRespondent = (
      await client.query(
        'SELECT * FROM group_poll_responses WHERE poll_id=$1',
        [pollId]
      )
    ).rowCount;
    const agreeCount = (
      await client.query(
        'SELECT * FROM group_poll_responses WHERE poll_id=$1 AND is_agree=true',
        [pollId]
      )
    ).rowCount;
    const disagreeCount = (
      await client.query(
        'SELECT * FROM group_poll_responses WHERE poll_id=$1 AND is_agree=false',
        [pollId]
      )
    ).rowCount;

    result.pollObj = {
      ...pollData,
      totalRespondent,
      agreeCount,
      disagreeCount,
    };
  } catch (error) {
    console.error('Error while getting a poll: ', error);
    result.error = 'Fail to retrieve poll information.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}

export async function submitVote(pollId: string, decision: boolean) {
  const result = {
    success: false,
    error: '',
  };

  const { client, endPool } = await connectDB();

  try {
    const user = await getUser();
    const userId = user?.id;

    // reject vote if the user has been participated already
    const hasVoted =
      (
        await client.query(
          'SELECT * FROM group_poll_responses WHERE poll_id=$1 AND user_id=$2',
          [pollId, userId]
        )
      ).rowCount > 0;

    if (hasVoted) {
      result.error = 'Can only vote one time!';
      return result;
    }

    await client.query(
      'INSERT INTO group_poll_responses(poll_id, user_id, is_agree) VALUES ($1, $2, $3)',
      [pollId, userId, decision]
    );

    result.success = true;
  } catch (error) {
    console.error('Error while sending vote: ', error);
    result.error = 'Fail to submit vote.';
  } finally {
    client.release();
    endPool();
    return result;
  }
}
