'use client';
/** MOBILE-FIRST CHAT HEADER */
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ChatAvatar from '../ui/chatAvatar';
import Image from 'next/image';
import Link from 'next/link';
import Notification from './friend_request/notification';
import { FriendRequestInfo, User } from '../lib/definitions';
import { getUserSession } from '../lib/helpers';
import { getAllUserFriendRequests, getUser } from '../lib/actions';
import { Spinner } from 'flowbite-react';

const MESSAGES_URL = '/main';
const GROUP_URL = '/main/groups';
const FRIENDS_URL = '/main/friends';

export default function ChatHeader() {
  // Hooks and states
  const currentPath = usePathname();
  const router = useRouter();
  const [stateLoading, setStateLoading] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [userState, setUserState] = useState<User>({
    username: '',
    status: '',
    id: '',
    friends_count: 0,
    is_online: false,
    password: '',
    profile_img: '',
    additional_info: null,
  });
  const [friendRequests, setFriendRequests] = useState<FriendRequestInfo[]>([]);
  const totalFriendRequests = friendRequests.length;

  // run on the first time render
  useEffect(() => {
    // get friend requests
    const friendReqResponse = async () => {
      const response = await getAllUserFriendRequests();
      if (!response.error) {
        const friendReqData = response.friendRequests;
        setFriendRequests(friendReqData);
      }
      // handle error gracefully...
    };

    // get user object
    const getUserObjResponse = async () => {
      const userSession = getUserSession();
      if (!userSession) {
        return router.push('/auth/login');
      }
      const user = await getUser();
      if (!user) {
        router.push('/auth/login');
      }

      // set user obj to state
      setUserState(user!);
      setStateLoading(false);
    };

    friendReqResponse();
    getUserObjResponse();
  }, []);

  if (stateLoading) {
    // Should change to element skeleton for better UI
    return (
      <div className='text-center pt-10'>
        <Spinner aria-label='Loading spinner' size='xl' />;
      </div>
    );
  }

  return (
    <>
      {showNotification && (
        <Notification
          data={friendRequests}
          onClose={setShowNotification}
          onActionApplied={setFriendRequests}
        />
      )}
      <header className='bg-white'>
        {/* Logo */}
        <div className='flex justify-center items-center pt-3'>
          <Image
            src='/chat_icon.svg'
            alt='Liaoliao logo'
            width='30'
            height='30'
          />
        </div>
        {/* Profile section */}
        <div className='pt-[3rem] mx-[1rem] flex justify-between'>
          <Link href='/profile'>
            <div className='flex gap-3 items-center'>
              <ChatAvatar username={userState!.username || ''} />
              <div>
                <p className='font-bold'>{userState!.username || 'loading'}</p>
                <p className='text-xs text-slate-400'>
                  {userState!.status || ''}
                </p>
              </div>
            </div>
          </Link>
          {/* Notification bell icon */}
          <div
            onClick={() => setShowNotification(true)}
            className='cursor-pointer border border-blue rounded-full w-[15%] p-1 hover:bg-slate-100 flex items-center justify-center'
          >
            <svg
              className='w-6 h-6 text-blue'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M17.1 12.6v-1.8A5.4 5.4 0 0 0 13 5.6V3a1 1 0 0 0-2 0v2.4a5.4 5.4 0 0 0-4 5.5v1.8c0 2.4-1.9 3-1.9 4.2 0 .6 0 1.2.5 1.2h13c.5 0 .5-.6.5-1.2 0-1.2-1.9-1.8-1.9-4.2ZM8.8 19a3.5 3.5 0 0 0 6.4 0H8.8Z' />
            </svg>
            <span className='font-bold'>{totalFriendRequests}</span>
          </div>
        </div>
        {/* Main nav menu */}
        <div className='flex justify-between mt-[2rem]'>
          <Link
            href='/main'
            className={`basis-full border-b-4 ${
              currentPath === MESSAGES_URL
                ? 'border-blue text-blue'
                : 'text-slate-300'
            } py-[1rem] px-[1.5rem] text-center cursor-pointer hover:bg-slate-100`}
          >
            Messages
          </Link>
          <Link
            href='/main/groups'
            className={`basis-full border-b-4 ${
              currentPath === GROUP_URL
                ? 'border-blue text-blue'
                : 'text-slate-300'
            } py-[1rem] px-[1.5rem] text-center cursor-pointer hover:bg-slate-100`}
          >
            Groups
          </Link>
          <Link
            href='/main/friends'
            className={`basis-full border-b-4 ${
              currentPath === FRIENDS_URL
                ? 'border-blue text-blue'
                : 'text-slate-300'
            } py-[1rem] px-[1.5rem] text-center cursor-pointer hover:bg-slate-100`}
          >
            Friends
          </Link>
        </div>
      </header>
    </>
  );
}
