'use client';

import {
  acceptFriendRequest,
  getAllUserFriendRequests,
  rejectFriendRequest,
} from '@/app/lib/actions';
import { FriendRequestInfo, User } from '@/app/lib/definitions';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Alert, Button } from 'flowbite-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type NotificationBubbleProps = {
  requestInfo: FriendRequestInfo;
  onActionApplied: Dispatch<SetStateAction<FriendRequestInfo[]>>;
};

export default function NotificationBubble({
  requestInfo,
  onActionApplied,
}: NotificationBubbleProps) {
  const { id, from_id: requesterId, requester } = requestInfo;

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [processingRequest, setProcessingRequest] = useState<boolean>(false);

  const acceptFriendHandler = async () => {
    setProcessingRequest(true);
    const response = await acceptFriendRequest(requesterId);
    if (response.error) {
      setErrorMsg(response.error);
    } else {
      setSuccessMsg(`${requester} is now friend with you.`);
    }
    setShowAlert(true);
    setProcessingRequest(false);
  };

  const rejectFriendHandler = async () => {
    setProcessingRequest(true);
    const response = await rejectFriendRequest(id);
    if (response.error) {
      setErrorMsg(response.error);
      setShowAlert(true);
    }
    const updatedFriendRequest = await getAllUserFriendRequests();
    onActionApplied(updatedFriendRequest.friendRequests);
    setProcessingRequest(false);
  };

  useEffect(() => {
    const feedbackTimeout = setTimeout(async () => {
      setErrorMsg('');
      setSuccessMsg('');
      setShowAlert(false);
      // update the friend request while success
      const updatedFriendRequest = await getAllUserFriendRequests();
      onActionApplied(updatedFriendRequest.friendRequests);
    }, 3000);

    return () => {
      clearTimeout(feedbackTimeout);
    };
  }, [errorMsg, successMsg, showAlert]);

  return (
    <>
      {showAlert && (
        <Alert
          className='absolute top-5 left-5'
          color={errorMsg ? 'failure' : 'info'}
        >
          {errorMsg ? `${errorMsg}` : `${successMsg}`}
        </Alert>
      )}
      <div className='flex items-center justify-between py-3 px-2'>
        <div className='flex gap-3'>
          <ChatAvatar username={requester} />
          <div className='flex items-center'>
            <p className='font-bold'>{requester}</p>
          </div>
        </div>
        <div className='flex gap-2'>
          {/* If the user befriended, just show 'already friend' */}
          <Button
            onClick={() => rejectFriendHandler()}
            color='failure'
            disabled={processingRequest}
          >
            {/* Close icon */}
            <svg
              className='w-6 h-6 text-white'
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
                d='M6 18 18 6m0 12L6 6'
              />
            </svg>
          </Button>
          <Button
            onClick={() => acceptFriendHandler()}
            color='success'
            disabled={processingRequest}
          >
            {/* Check icon */}
            <svg
              className='w-6 h-6 text-white'
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
                d='m5 12 4.7 4.5 9.3-9'
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}
