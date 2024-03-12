'use client';
import { Message } from '@/app/lib/definitions';
import ChatItem from './chatItem';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dotenv from 'dotenv';
import { Socket } from 'socket.io';
import { Button, TextInput } from 'flowbite-react';
dotenv.config();

type ChatBodyProps = {
  messages: { [key: string]: Message[] };
  currentUserId: string | undefined;
};

export default function ChatBody({ messages, currentUserId }: ChatBodyProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
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
        <ChatItem
          key={message.id}
          type={message.creator_id === currentUserId ? 'sender' : 'receiver'}
          message={message.text}
          creatorUsername={message.creator_username}
          timestamp={message.timestamp}
        />
      );
    });
  }

  return (
    <>
      <div className='mt-5 mb-[3rem] mx-2 max-h-[70%] overflow-auto'>
        {chatMessagesUi}
      </div>
    </>
  );
}
