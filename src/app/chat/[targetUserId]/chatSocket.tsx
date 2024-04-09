'use client';

import { Message, OpenChatRoomResponse, User } from '@/app/lib/definitions';
import { useContext, useEffect, useRef, useState } from 'react';
// import { Socket } from 'socket.io';
import { Socket, io } from 'socket.io-client';
import ChatTag from './chatTag';
import ChatBody from './chatBody';
import ChatActions from './chatActions';
import {
  JOIN_ROOM,
  MAKE_OFFLINE,
  POPULATE_CHAT,
  RECEIVE_MESSAGE,
  SEND_MESSAGE,
} from '@/app/lib/socketEvents';
import { Button, Spinner } from 'flowbite-react';
import ChatContext, { ChatContextProvider } from '@/app/store/chatContext';
import { EdgeStoreProvider } from '@/app/lib/edgestore';

type ChatSocketProps = {
  chatProps: {
    receiver: User | undefined;
    messages: { [key: string]: Message[] };
    currentUserId: string | undefined;
    chatRoomId: string;
    targetUserId: string | undefined;
  };
};

type ChatSocketComponentProps = {
  currentUserId: string | undefined;
  targetUserId: string | undefined;
  chatRoomId: string | undefined;
};

export default function ChatSocket({ chatProps }: ChatSocketProps) {
  return (
    <EdgeStoreProvider>
      <ChatContextProvider>
        <ChatSocketComponent
          currentUserId={chatProps.currentUserId}
          targetUserId={chatProps.targetUserId}
          chatRoomId={chatProps.chatRoomId}
        />
      </ChatContextProvider>
    </EdgeStoreProvider>
  );
}

const ChatSocketComponent = ({
  currentUserId,
  targetUserId,
  chatRoomId,
}: ChatSocketComponentProps) => {
  const chatContext = useContext(ChatContext);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io('http://localhost:3500');
    socket.on('connect', () => {
      // @ts-ignore
      setSocket(socket);
      console.log(`Socket connected from ID: ${socket.id}`);
      socket.emit(JOIN_ROOM, { chatRoomId, currentUserId, targetUserId });
      // make user online
      chatContext.makeOnline(currentUserId!);
    });

    socket.on(POPULATE_CHAT, async (_) => {
      // console.log('Chat room data: ', chatRoomData);
      await chatContext.getChatRoom(targetUserId!);
      bottomDivRef.current?.scrollIntoView({ behavior: 'instant' }); // scroll to the end of the page
    });
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000);
    });

    // to make user status offline
    window.addEventListener('beforeunload', () => {
      socket.emit(MAKE_OFFLINE, { userId: currentUserId });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (chatContext.loading) {
    return (
      <div className='text-center mt-3'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <>
      {/* Chat Tag (Header) */}
      <ChatTag receiver={chatContext.receiver} />
      <hr />
      {/* Chat Body */}
      <ChatBody messages={chatContext.messages} currentUserId={currentUserId} />
      {/* Chat Actions */}
      <div className='mt-5' ref={bottomDivRef} />
      <ChatActions chatRoomId={chatContext.chatRoomId} socket={socket} />
    </>
  );
};
