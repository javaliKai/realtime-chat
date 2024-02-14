'use client';

import { Card } from 'flowbite-react';
import ChatAvatar from '../ui/chatAvatar';

type ChatCardProps = {
  username: string;
};

export default function ChatCard({ username }: ChatCardProps) {
  return (
    <div className='border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r px-4 py-5 flex justify-between leading-normal'>
      <div className='flex gap-3 items-centerr'>
        <ChatAvatar username={username} />
        <div>
          <p className='font-bold'>{username}</p>
          <p className='text-xs text-slate-400'>recent text</p>
        </div>
      </div>
      <div>
        <p>13:15</p>
        <span>
          <svg
            className='w-6 h-6 text-slate-300'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              fillRule='evenodd'
              d='M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm13.7-1.3a1 1 0 0 0-1.4-1.4L11 12.6l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l4-4Z'
              clipRule='evenodd'
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
