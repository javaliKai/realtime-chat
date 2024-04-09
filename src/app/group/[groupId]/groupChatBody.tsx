'use client';
import { GroupMessage } from '@/app/lib/definitions';
import GroupChatItem from './groupChatItem';
import { Socket } from 'socket.io-client';

type GroupChatBodyProps = {
  messages: { [key: string]: GroupMessage[] };
  currentUserId: string | undefined;
  socket: Socket;
};

export default function GroupChatBody({
  messages,
  currentUserId,
  socket,
}: GroupChatBodyProps) {
  const chatMessagesUi: React.ReactNode[] = [];

  for (const date in messages) {
    const dateObj = new Date(date);
    const currentDateObj = new Date();
    let dateText = date;
    // format the date, if the date is today, then render 'today'
    const dateIsToday =
      dateObj.getFullYear() === currentDateObj.getFullYear() &&
      dateObj.getMonth() + 1 === currentDateObj.getMonth() + 1 &&
      dateObj.getDate() === currentDateObj.getDate();
    if (dateIsToday) {
      dateText = 'Today';
    }

    const dateTextElement = (
      <p
        key={Math.random() * 64}
        className='text-center text-xs text-slate-500'
      >
        {dateText}
      </p>
    );
    chatMessagesUi.push(dateTextElement);

    // push all messages record for the current date into the messages UI
    messages[date].forEach((message) => {
      chatMessagesUi.push(
        <GroupChatItem
          key={message.id}
          type={message.creator_id === currentUserId ? 'sender' : 'receiver'}
          messageType={message.type}
          message={message.text}
          messageId={message.id}
          creatorUsername={message.creator_username}
          timestamp={message.timestamp}
          socket={socket}
        />
      );
    });
  }

  return (
    <>
      <div className='mt-5 mb-[3rem] mx-2 min-h-[70vh] max-h-[70%] overflow-auto'>
        {chatMessagesUi}
      </div>
    </>
  );
}
