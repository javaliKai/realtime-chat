import { Card } from 'flowbite-react';
import Image from 'next/image';
import ProfileCard from './profileCard';
import Link from 'next/link';
import { getUserSession, protectedPage } from '../lib/helpers';
import { redirect } from 'next/navigation';
import { getUser } from '../lib/actions';

export default async function Profile() {
  protectedPage();

  // Get user info from db
  const user = await getUser();
  if (!user) {
    return redirect('/auth/login');
  }

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
      <Link href='/main'>
        <div className='relative z-1 rounded-full bg-white w-[7%] mt-5 ml-3 hover:bg-slate-300 focus:bg-red-200 transition'>
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
      </Link>

      {/* Main profile card */}
      <ProfileCard user={user} />
    </>
  );
}
