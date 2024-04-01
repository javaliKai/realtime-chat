'use client';

import FileChatItem from '@/app/chat/[targetUserId]/fileChatItem';
import ChatAvatar from '@/app/ui/chatAvatar';
import GroupPollDisplay from './groupPollDisplay';
import { Socket } from 'socket.io-client';

type GroupChatItemProps = {
  message: string;
  type: 'receiver' | 'sender';
  messageType: string;
  timestamp: Date | string;
  creatorUsername: string;
  socket: Socket;
};

export default function GroupChatItem({
  message,
  type,
  messageType,
  timestamp,
  creatorUsername,
  socket,
}: GroupChatItemProps) {
  // constructing timestamp using 24 hour system
  let timeText = '';
  const timestampDateObj = new Date(timestamp);
  const hour = timestampDateObj.getHours();
  const minute = timestampDateObj.getMinutes();
  if (hour < 10) {
    timeText += `0${hour}`;
  } else {
    timeText += hour;
  }
  timeText += ':';
  if (minute < 10) {
    timeText += `0${minute}`;
  } else {
    timeText += minute;
  }

  // conditional styling to make a distinction between sender and receiver
  const shouldReverse = type === 'sender';
  const bubbleStyle = type === 'sender' ? 'rounded-tl-xl' : 'rounded-tr-xl';
  const usernamePosition = type === 'sender' ? 'text-end' : 'text-left';

  // conditional content for message
  let messageView;
  if (messageType === 'file') {
    messageView = <FileChatItem fileName={message} />;
  } else if (messageType === 'poll') {
    messageView = <GroupPollDisplay pollId={message} socket={socket} />;
  } else {
    messageView = <p className='break-words'>{message}</p>;
  }

  return (
    <div
      className={`px-3 my-5 flex ${shouldReverse && 'flex-row-reverse'} gap-2`}
    >
      <div className='flex flex-col'>
        <ChatAvatar username={creatorUsername} />
      </div>
      <div
        className={`flex flex-col justify-between max-w-[70%] min-w-[10%] ${usernamePosition}`}
      >
        <p className='text-xs text-gray-700'>{creatorUsername}</p>
        <div className={`bg-gray-200 px-2 py-2 rounded-b-xl ${bubbleStyle}`}>
          {messageView}
          <p className='text-xs text-right text-gray-400'>{timeText}</p>
        </div>
      </div>
    </div>
  );
}
