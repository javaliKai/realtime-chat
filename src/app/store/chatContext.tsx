'use client';

import { createContext, useState } from 'react';
import { getUser as getUserAction, openChatRoom } from '../lib/actions';
import { Message, OpenChatRoomResponse, User } from '../lib/definitions';

type ChatContextType = {
  receiver: User | undefined;
  messages: { [key: string]: Message[] };
  chatRoomId: string;
  loading: boolean;
  getChatRoom: (userId: string) => Promise<boolean> | void;
  targetUserId: string;
};

const ChatContext = createContext<ChatContextType>({
  receiver: undefined,
  messages: {},
  chatRoomId: '',
  loading: true,
  getChatRoom: (userId) => {},
  targetUserId: '',
});

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<{
    receiver: User | undefined;
    messages: { [key: string]: Message[] };
    chatRoomId: string;
    loading: boolean;
    targetUserId: string;
  }>({
    receiver: undefined,
    messages: {},
    chatRoomId: '',
    loading: true,
    targetUserId: '',
  });

  const getChatRoom = async (userId: string) => {
    const chatRoom = await openChatRoom(userId);
    if (chatRoom.error) {
      return false;
    }

    setData((_) => {
      return {
        receiver: chatRoom.receiver,
        messages: chatRoom.messages,
        chatRoomId: chatRoom.id,
        targetUserId: userId,
        loading: false,
      };
    });

    return true;
  };

  return (
    <ChatContext.Provider
      value={{
        ...data,
        getChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
