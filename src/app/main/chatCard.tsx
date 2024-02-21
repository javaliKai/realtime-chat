'use client';

import { Alert, Card } from 'flowbite-react';
import ChatAvatar from '../ui/chatAvatar';
import { ChatRoom } from '../lib/definitions';
import { useEffect, useState } from 'react';
import { getChatCardData } from '../lib/actions';
import Link from 'next/link';

type ChatCardProps = {
  chatRoomData: ChatRoom;
};

type ChatCardComponentData = {
  receiverId: string;
  receiverUsername: string;
  lastUsername: string;
  lastMessageTxt: string;
  timestamp: string;
};

export default function ChatCard({ chatRoomData }: ChatCardProps) {
  const [chatCardData, setChatCardData] = useState<ChatCardComponentData>({
    receiverId: '',
    receiverUsername: '',
    lastUsername: '',
    lastMessageTxt: '',
    timestamp: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const populateChatCardData = async () => {
      const result = await getChatCardData(chatRoomData);
      if (result.error) {
        setErrorMsg(result.error);
        setLoading(false);
        return;
      }
      const transformedTimestamp = new Date(result.timestamp!);
      const cd = new Date();
      const isToday =
        transformedTimestamp.getFullYear() === cd.getFullYear() &&
        transformedTimestamp.getMonth() + 1 === cd.getMonth() + 1 &&
        transformedTimestamp.getDate() === cd.getDate();

      setChatCardData({
        receiverId: result.receiverId,
        receiverUsername: result.receiverUsername,
        lastUsername: result.lastUsername,
        lastMessageTxt: result.lastMessageTxt,
        timestamp: isToday
          ? 'Today'
          : `${transformedTimestamp.getFullYear()}/${
              transformedTimestamp.getMonth() + 1
            }/${transformedTimestamp.getDate()}`,
      });
      setLoading(false);
    };

    populateChatCardData();
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <>
      {errorMsg && (
        <Alert className='fixed right-3 top-[2rem]' color='failure'>
          {errorMsg}
        </Alert>
      )}
      <Link
        href={`/chat/${chatCardData.receiverId}`}
        className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r px-4 py-5 flex justify-between leading-normal'
      >
        <div className='flex gap-3 items-centerr'>
          <ChatAvatar username={chatCardData.receiverUsername} />
          <div>
            <p className='font-bold'>{chatCardData.receiverUsername}</p>
            <p className='text-xs text-slate-400'>
              {chatCardData.lastUsername}: {chatCardData.lastMessageTxt}
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <p className='text-sm text-slate-500'>{chatCardData.timestamp}</p>
        </div>
      </Link>
    </>
  );
}
