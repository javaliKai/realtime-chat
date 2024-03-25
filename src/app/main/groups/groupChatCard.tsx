'use client';

import { Group } from '@/app/lib/definitions';
import ChatAvatar from '@/app/ui/chatAvatar';
import Link from 'next/link';

type GroupChatCardProps = {
  chatRoomData: Group;
};

export default function GroupChatCard({ chatRoomData }: GroupChatCardProps) {
  return (
    <>
      <Link
        href={`/group/${chatRoomData.id}`}
        // href={`/chat/${chatCardData.receiverId}`}
        className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r px-4 py-5 flex justify-between leading-normal'
      >
        <div className='flex gap-3 items-centerr'>
          <ChatAvatar username={chatRoomData.group_name} />
          <div>
            <p className='font-bold'>{chatRoomData.group_name}</p>
            <p className='text-xs text-slate-400'>
              {/* {chatRoomData.lastUsername}: {chatRoomData.lastMessageTxt} */}
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          {/* <p className='text-sm text-slate-500'>{chatRoomData.timestamp}</p> */}
        </div>
      </Link>
    </>
  );
}
