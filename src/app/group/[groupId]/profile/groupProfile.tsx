'use client';

import { getUser } from '@/app/lib/actions';
import { protectedPage } from '@/app/lib/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import GroupProfileCard from './groupProfileCard';
import { Group } from '@/app/lib/definitions';

type GroupProfileProps = {
  group: Group;
};

export default function GroupProfile({ group }: GroupProfileProps) {
  const router = useRouter();

  return (
    <>
      <Image
        className='absolute top-[-20vh] mx-auto z-[-1]'
        src='/background_profile.png'
        alt=''
        width='520'
        height='520'
      />
      {/* Back button */}
      <div
        onClick={() => router.back()}
        className='cursor-pointer relative z-1 rounded-full bg-white w-[7%] mt-5 ml-3 hover:bg-slate-300 focus:bg-red-200 transition'
      >
        <div className='relative p-1 '>
          <svg
            className='w-6 h-6 text-gray-800 dark:text-white'
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
      </div>

      {/* Main profile card */}
      <GroupProfileCard
        groupName={group.group_name}
        groupSlug={group.group_slug}
      />
    </>
  );
}
