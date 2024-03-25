'use client';

import ChatCard from '../chatCard';
import { redirect } from 'next/navigation';
import { getChatGroups, getChatRooms, getUser } from '../../lib/actions';
import { useEffect, useState } from 'react';
import { ChatRoom, Group } from '../../lib/definitions';
import { Alert } from 'flowbite-react';
import GroupAction from './groupActions';
import GroupActions from './groupActions';
import GroupChatCard from './groupChatCard';

/** List out all messages */
export default function Page() {
  const [chatGroups, setChatGroups] = useState<Group[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    // get all chat rooms during initial render
    const getAllChatGroups = async () => {
      const result = await getChatGroups();
      console.log(result);
      if (result.error) {
        setErrorMsg(result.error);
        return;
      }
      setChatGroups(result.groups);
    };

    getAllChatGroups();
  }, []);

  return (
    <>
      {errorMsg && (
        <Alert className='fixed right-3 top-[2rem]' color='failure'>
          {errorMsg}
        </Alert>
      )}
      <div>
        <GroupActions />
        {chatGroups.map((room) => (
          <GroupChatCard key={room.id} chatRoomData={room} />
        ))}
      </div>
    </>
  );
}
