'use client';

import { Modal, Button, TextInput } from 'flowbite-react';
import UserBubble from './userBubble';
import { buttonPrimary } from '@/app/ui/buttonTheme';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { findUsername } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';

type SearchModalProps = {
  showModal: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
};

export default function SearchModal({ showModal, onClose }: SearchModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    // search for user on 1 second delay
    if (usernameInput.length > 0) {
      const searchFriendTimeout = setTimeout(async () => {
        setLoading(true);
        // make request to the server
        const queryResult = await findUsername(usernameInput);
        setUserList(queryResult.users);
        setLoading(false);
      }, 1000);
      return () => {
        clearTimeout(searchFriendTimeout);
      };
    }
  }, [usernameInput]);

  return (
    <Modal
      className='pt-[10vh]'
      show={showModal}
      size='md'
      onClose={() => onClose(false)}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <div className='mb-3'>
            <h3 className='text-xl'>Add New Friends</h3>
          </div>
          <div className='mb-3'>
            <TextInput
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder='enter username...'
              type='text'
              required
            />
          </div>
          <div className='my-10 max-h-[50vh] overflow-y-auto'>
            {loading && <p className='italic'>Searching for user...</p>}
            {/* Render searched user here... */}
            {userList.map((user) => (
              <UserBubble key={user.id} user={user} />
            ))}
          </div>
          <div className='flex justify-center'>
            <Button
              onClick={() => onClose(false)}
              theme={buttonPrimary}
              color='blue'
            >
              Back
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
