'use client';
import { buttonSecondary } from '@/app/ui/buttonTheme';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import GroupPolllModal from './groupPollModal';
import { useState } from 'react';

type GroupChatTagProps = {
  groupName: string;
  groupId: string;
  totalMember: number;
};

export default function GroupChatTag({
  groupName,
  groupId,
  totalMember,
}: GroupChatTagProps) {
  const [showPollModal, setShowPollNodal] = useState<boolean>(false);

  const setPollModal = (state: boolean) => {
    setShowPollNodal(state);
  };

  return (
    <>
      <GroupPolllModal
        showPollModal={showPollModal}
        setPollModal={setPollModal}
      />
      <header className='min-h-[5rem] bg-whitebg sticky top-0 px-3 flex justify-between items-center'>
        <div className='flex gap-3 items-center'>
          <Link href='/main/groups' className='cursor-pointer'>
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
          </Link>
          <Link
            href={`/group/${groupId}/profile`}
            className='flex gap-3 items-center'
          >
            <ChatAvatar username={groupName} />
            <div className='flex flex-col items-start'>
              <span className='text-lg'>{groupName}</span>
              <span className='text-sm text-gray-500'>
                {totalMember} {totalMember > 1 ? 'Members' : 'Member'}
              </span>
            </div>
          </Link>
        </div>

        <Button
          onClick={() => setPollModal(true)}
          className='mr-3'
          theme={buttonSecondary}
          color='blue'
          title='start poll'
        >
          {/* Polling icon */}
          <svg
            className='w-6 h-6'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z'
            />
          </svg>
        </Button>
      </header>
    </>
  );
}
