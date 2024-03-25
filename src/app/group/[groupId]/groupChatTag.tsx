'use client';
import ChatAvatar from '@/app/ui/chatAvatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  return (
    <>
      <header className='min-h-[5rem] px-3 flex gap-3 items-center'>
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
      </header>
    </>
  );
}
