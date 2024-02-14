'use client';

import { addFriend, checkIsFriend } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Alert, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';

type UserBubbleProps = {
  user: User;
};

export default function UserBubble({ user }: UserBubbleProps) {
  const { id, username, is_online } = user;
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [processingRequest, setProcessingRequest] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isFriend, setIsFriend] = useState<boolean>(false);

  const addFriendHandler = async () => {
    setProcessingRequest(true);
    const result = await addFriend(id);
    if (!result.success) {
      setErrorMsg(result.error);
    }
    setShowAlert(true);
    setProcessingRequest(false);
  };

  // side-effect for checking whether current user is already friend
  useEffect(() => {
    const isFriendCheck = async () => {
      const result = await checkIsFriend(id);
      if (result.isFriend) {
        setIsFriend(true);
      }
    };

    isFriendCheck();
  }, []);

  useEffect(() => {
    const alertTimeout = setTimeout(() => {
      setShowAlert(false);
      setErrorMsg('');
    }, 3000);
    return () => {
      clearTimeout(alertTimeout);
    };
  }, [showAlert, errorMsg]);

  return (
    <>
      {showAlert && (
        <Alert
          className='absolute top-5 left-5'
          color={errorMsg.length > 0 ? 'failure' : 'info'}
        >
          {errorMsg.length > 0
            ? `${errorMsg}`
            : `Friend request to ${username} is sent
`}
        </Alert>
      )}
      <div className='flex items-center justify-between py-3 px-2'>
        <div className='flex gap-3'>
          <ChatAvatar username={username} />
          <div className='flex flex-col'>
            <p className='font-bold'>{username}</p>
            <p className='text-left'>{is_online ? '🟢 online' : 'offline'}</p>
          </div>
        </div>
        <div>
          {/* If the user befriended, just show 'already friend' */}
          <Button
            onClick={() => addFriendHandler()}
            color='success'
            disabled={processingRequest || isFriend}
          >
            {isFriend ? 'Already friend' : 'Add'}
          </Button>
        </div>
      </div>
    </>
  );
}
