'use client';

import ChatCard from './chatCard';
import { redirect } from 'next/navigation';
import { getChatRooms, getUser } from '../lib/actions';
import { useEffect, useState } from 'react';
import { ChatRoom } from '../lib/definitions';
import { Alert } from 'flowbite-react';

/** List out all messages */
export default function Page() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  console.log(chatRooms);

  useEffect(() => {
    // get all chat rooms during initial render
    const getAllChatRooms = async () => {
      const result = await getChatRooms();
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }
      setChatRooms(result.chatRooms);
    };

    getAllChatRooms();
  }, []);

  return (
    <>
      {errorMsg && (
        <Alert className='fixed right-3 top-[2rem]' color='failure'>
          {errorMsg}
        </Alert>
      )}
      <div>
        {chatRooms.map((room) => (
          <ChatCard key={room.id} chatRoomData={room} />
        ))}
      </div>
    </>
  );
}
