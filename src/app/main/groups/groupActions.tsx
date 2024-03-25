'use client';

import { useState } from 'react';
import CreateGroupModal from './createGroupModal';
import JoinGroupModal from './joinGroupModal';

export default function GroupActions() {
  const [showModal, setShowModal] = useState<{
    createModal: boolean;
    joinModal: boolean;
  }>({
    createModal: false,
    joinModal: false,
  });

  const setCreateModal = (status: boolean) => {
    setShowModal((prevState) => {
      return { ...prevState, createModal: status };
    });
  };

  const setJoinModal = (status: boolean) => {
    setShowModal((prevState) => {
      return { ...prevState, joinModal: status };
    });
  };

  return (
    <>
      <CreateGroupModal
        showCreateModal={showModal.createModal}
        setCreateModal={setCreateModal}
      />
      <JoinGroupModal
        showJoinModal={showModal.joinModal}
        setJoinModal={setJoinModal}
      />
      <div className='flex justify-evenly'>
        <div
          onClick={() => setCreateModal(true)}
          className='flex gap-3 items-center mt-5 mb-10 transition py-3 px-1 rounded-full cursor-pointer'
        >
          <div className='bg-blue w-[10vw] text-center flex justify-center items-center p-2 rounded-full'>
            {/* Group icon */}
            <svg
              className='w-6 h-6 text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <p className='font-bold'>Create Group</p>
        </div>
        <div
          onClick={() => setJoinModal(true)}
          className='flex gap-3 items-center mt-5 mb-10 transition py-3 px-1 rounded-full cursor-pointer'
        >
          <div className='bg-blue w-[10vw] text-center flex justify-center items-center p-2 rounded-full'>
            {/* Add icon */}
            <svg
              className='w-6 h-6 text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <p className='font-bold'>Join Group</p>
        </div>
      </div>
    </>
  );
}
