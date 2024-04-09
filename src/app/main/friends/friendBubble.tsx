'uses client';

import { buttonPrimary, buttonSecondary } from '@/app/ui/buttonTheme';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Button } from 'flowbite-react';
import Link from 'next/link';

type FriendBubbleProps = {
  username: string;
  userId: string;
  isOnline: boolean;
};

export default function FriendBubble({
  username,
  userId: targetUserId,
  isOnline,
}: FriendBubbleProps) {
  return (
    <>
      <div className='flex items-center justify-between py-3 px-2'>
        <div className='flex gap-3'>
          <ChatAvatar username={username} />
          <div className='flex items-center'>
            <p>{username}</p>
          </div>
          <span className='flex items-center text-xs'>
            {isOnline ? '🟢 Online' : 'Offline'}
          </span>
        </div>
        <Link href={`/chat/${targetUserId}`}>
          <Button
            theme={buttonSecondary}
            color='blue'
            className='text-blue hover:text-white'
          >
            Chat
          </Button>
        </Link>
      </div>
    </>
  );
}
