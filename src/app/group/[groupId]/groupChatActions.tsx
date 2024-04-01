'use client';

import { getUser } from '@/app/lib/actions';
import {
  GROUP_MESSAGE_FAILED,
  GROUP_MESSAGE_SUCCESS,
  SEND_GROUP_MESSAGE,
} from '@/app/lib/socketEvents';
import { buttonAction } from '@/app/ui/buttonTheme';
import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import GroupFileUpload from './groupFileUpload';

type GroupChatActionsProps = {
  groupId: string;
  socket: Socket | undefined;
};

export default function GroupChatActions({
  groupId,
  socket,
}: GroupChatActionsProps) {
  const [messageInput, setMessageInput] = useState<string>('');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const messageInputChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessageInput(e.target.value);
  };

  const sendMessageHandler = async () => {
    setSendingMessage(true);
    if (socket) {
      const user = await getUser();
      const creatorUsername = user!.username;
      const senderUserId = user!.id;
      socket.emit(SEND_GROUP_MESSAGE, {
        groupId,
        creatorUsername,
        text: messageInput,
        senderUserId,
      });
    }
  };

  useEffect(() => {
    socket?.on(GROUP_MESSAGE_SUCCESS, (_) => {
      setMessageInput('');
      setSendingMessage(false);
    });
    socket?.on(GROUP_MESSAGE_FAILED, (_) => {
      setErrorMsg('Fail to send message.');
      setSendingMessage(false);
    });
  }, [socket]);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setErrorMsg('');
    }, 3000);
    return () => {
      clearTimeout(errorTimeout);
    };
  }, [errorMsg]);

  return (
    <>
      {errorMsg && (
        <Alert className='fixed right-3 top-[2rem]' color='failure'>
          {errorMsg}
        </Alert>
      )}
      {/* <div className='w-full px-3 py-3 fixed bottom-0 border-y-2 bg-whitebg'> */}
      <div className='w-full px-3 py-3 sticky bottom-0 border-y-2 bg-whitebg'>
        <div className='flex gap-5 items-center'>
          <GroupFileUpload />
          <div className='w-full'>
            <Textarea
              onChange={(e) => messageInputChangeHandler(e)}
              value={messageInput}
              placeholder='Type a message'
              rows={2}
              style={{ resize: 'none' }}
              maxLength={255}
            />
          </div>
          <div className='flex items-center'>
            <Button
              onClick={() => sendMessageHandler()}
              theme={buttonAction}
              color='blue'
              disabled={sendingMessage}
            >
              {/* Plane icon */}
              <svg
                className='w-6 h-8 text-white rotate-90'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  fillRule='evenodd'
                  d='M12 2c.4 0 .8.3 1 .6l7 18a1 1 0 0 1-1.4 1.3L13 19.5V13a1 1 0 1 0-2 0v6.5L5.4 22A1 1 0 0 1 4 20.6l7-18a1 1 0 0 1 1-.6Z'
                  clipRule='evenodd'
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
