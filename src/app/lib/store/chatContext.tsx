'use client';

import { createContext, useState } from 'react';
import { getUser as getUserAction, openChatRoom } from '../actions';
import { Message, OpenChatRoomResponse, User } from '../definitions';

type ChatContextType = {
  receiver: User | undefined;
  messages: { [key: string]: Message[] };
  chatRoomId: string;
  loading: boolean;
  getChatRoom: (userId: string) => Promise<boolean> | void;
};

const ChatContext = createContext<ChatContextType>({
  receiver: undefined,
  messages: {},
  chatRoomId: '',
  loading: true,
  getChatRoom: () => {},
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
  }>({
    receiver: undefined,
    messages: {},
    chatRoomId: '',
    loading: true,
  });

  const getChatRoom = async (userId: string) => {
    // Todo: call action from socket server instead

    const chatRoom = await openChatRoom(userId);
    console.log(chatRoom);
    if (chatRoom.error) {
      return false;
    }

    setData((prevState) => {
      return {
        ...prevState,
        receiver: chatRoom.receiver,
        messages: chatRoom.messages,
        chatRoomId: chatRoom.id,
        loading: false,
      };
    });

    return true;
  };

  return (
    <ChatContext.Provider
      value={{
        receiver: data.receiver,
        messages: data.messages,
        chatRoomId: data.chatRoomId,
        loading: data.loading,
        getChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
