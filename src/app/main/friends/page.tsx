'use client';

import { Suspense, useEffect, useState } from 'react';
import { Spinner, TextInput } from 'flowbite-react';
import SearchModal from './searchModal';
import FriendBubble from './friendBubble';
import { getAllUserFriends } from '@/app/lib/actions';
import { FriendData } from '@/app/lib/definitions';
import Loading from '@/app/ui/loading';

export default function Page() {
  // States
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [friendsLoading, setFriendsLoading] = useState<boolean>(true);
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<FriendData[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      setFriendsLoading(true);
      const response = await getAllUserFriends();

      // Handle errors
      if (response.error.length > 0) {
        setErrorMsg(response.error);
        return;
      }

      const friendsArr = response.friends;
      setFriends(friendsArr);
      setFilteredFriends(friendsArr);
      setFriendsLoading(false);
    };

    fetchFriends();
  }, []);

  const filterFriends = (username: string) => {
    setFilteredFriends(
      friends.filter((friend) => friend.username.includes(username))
    );
  };

  return (
    <>
      {/* Search modal */}
      <SearchModal showModal={showSearchModal} onClose={setShowSearchModal} />
      <div className='px-3 py-5'>
        <TextInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            filterFriends(e.target.value)
          }
          id='searchFriends'
          type='text'
          placeholder='search friends...'
          required
        />
        <div
          onClick={() => setShowSearchModal(true)}
          className='flex gap-5 items-center mt-5 mb-10 hover:bg-slate-200 transition py-3 px-1 rounded-full'
        >
          {/* Add friend icon */}
          <div className='bg-blue w-[10vw] text-center flex justify-center items-center p-2 rounded-full'>
            <svg
              className='w-6 h-6 text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1c0-.6.4-1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <p className='font-bold'>Add Friend</p>
        </div>
        <hr />
        {errorMsg && <p>{errorMsg}</p>}
        <div className='max-h-[50vh] overflow-y-auto'>
          <Suspense fallback={<Loading />}>
            {friendsLoading && (
              <div className='text-center mt-3'>
                <Spinner size='lg' />
              </div>
            )}
            {filteredFriends.length > 0 &&
              friends.map((friend) => (
                <FriendBubble
                  key={friend.id}
                  username={friend.username}
                  userId={friend.id}
                />
              ))}
          </Suspense>
        </div>
      </div>
    </>
  );
}
