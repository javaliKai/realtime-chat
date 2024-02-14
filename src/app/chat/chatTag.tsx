'use client';

import ChatAvatar from '../ui/chatAvatar';

export default function ChatTag() {
  return (
    <>
      <header className='min-h-[5rem] px-3 flex gap-3 items-center'>
        <div>
          {/* Back button */}
          <svg
            className='w-8 h-8 text-gray-800 dark:text-white'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 12h14M5 12l4-4m-4 4 4 4'
            />
          </svg>
        </div>
        <ChatAvatar username='test user' />
        <div className='flex flex-col items-start'>
          <span className='text-lg'>Test user</span>
          <span className='text-sm text-gray-500'>🟢 Online</span>
        </div>
      </header>
    </>
  );
}
