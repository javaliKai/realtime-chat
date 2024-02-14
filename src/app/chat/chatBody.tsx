'use client';

import ChatAvatar from '../ui/chatAvatar';
import ChatItem from './chatItem';

export default function ChatBody() {
  return (
    <>
      <div className='my-5'>
        <ChatItem type='sender' message='Selamat malam pak, saya mau tanya.' />
        <ChatItem type='receiver' message='Ya boleh, silahkan bertanya.' />
      </div>
    </>
  );
}
