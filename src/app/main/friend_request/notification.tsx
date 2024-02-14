'use client';

import { Button, Modal } from 'flowbite-react';
import UserBubble from '../friends/userBubble';
import { FriendRequest, FriendRequestInfo, User } from '../../lib/definitions';
import { buttonPrimary } from '../../ui/buttonTheme';
import NotificationBubble from './notificationBubble';
import { Dispatch, SetStateAction } from 'react';

const dummyUser: User = {
  id: 'none',
  username: 'new_user',
  password: '',
  is_online: false,
  profile_img: null,
  status: '',
  friends_count: 0,
  additional_info: null,
};

type NotificationProps = {
  data: FriendRequestInfo[];
  onClose: Dispatch<SetStateAction<boolean>>;
  onActionApplied: Dispatch<SetStateAction<FriendRequestInfo[]>>;
};

export default function Notification({
  data,
  onClose,
  onActionApplied,
}: NotificationProps) {
  return (
    <>
      <Modal
        show={true}
        className='pt-[10vh]'
        size='md'
        onClose={() => onClose(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <div className='mb-3'>
              <h3 className='text-xl'>Friend Requests ({data.length})</h3>
            </div>
            <div className='my-10 max-h-[50vh] overflow-y-auto'>
              {/* Render friend requests here... */}
              {data.map((friendReq) => (
                <NotificationBubble
                  key={friendReq.id}
                  requestInfo={friendReq}
                  onActionApplied={onActionApplied}
                />
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
    </>
  );
}
