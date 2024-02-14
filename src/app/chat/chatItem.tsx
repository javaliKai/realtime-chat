'use client';

import ChatAvatar from '../ui/chatAvatar';

type ChatItemProps = {
  message: string;
  type: 'receiver' | 'sender';
  timestamp?: Date | string;
};

export default function ChatItem({ message, type, timestamp }: ChatItemProps) {
  const shouldReverse = type === 'receiver';
  return (
    <div
      className={`px-3 my-5 flex ${shouldReverse && 'flex-row-reverse'} gap-2`}
    >
      <div className='flex flex-col'>
        <ChatAvatar username='test user' />
      </div>
      <div className='max-w-[70%] min-w-[10%] bg-gray-200 px-2 py-2 rounded-b-xl rounded-tr-xl'>
        <p>{message}</p>
        <p className='text-xs text-right text-gray-400'>19:44PM</p>
      </div>
    </div>
  );
}
