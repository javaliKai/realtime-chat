'use client';

import ChatAvatar from '../../ui/chatAvatar';

type ChatItemProps = {
  message: string;
  type: 'receiver' | 'sender';
  timestamp: Date | string;
  creatorUsername: string;
};

export default function ChatItem({
  message,
  type,
  timestamp,
  creatorUsername,
}: ChatItemProps) {
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

  return (
    <div
      className={`px-3 my-5 flex ${shouldReverse && 'flex-row-reverse'} gap-2`}
    >
      <div className='flex flex-col'>
        <ChatAvatar username={creatorUsername} />
      </div>
      <div
        className={`max-w-[70%] min-w-[10%] bg-gray-200 px-2 py-2 rounded-b-xl ${bubbleStyle}`}
      >
        <p>{message}</p>
        <p className='text-xs text-right text-gray-400'>{timeText}</p>
      </div>
    </div>
  );
}
