'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, TextInput, Textarea } from 'flowbite-react';
import { buttonAction, buttonPrimary } from '../../ui/buttonTheme';
import { getUser, sendMessage } from '@/app/lib/actions';
import { Socket } from 'socket.io-client';
import {
  MESSAGE_FAILED,
  MESSAGE_SUCCESS,
  SEND_MESSAGE,
} from '@/app/lib/socketEvents';

type ChatActionProps = {
  chatRoomId: string;
  socket: Socket | undefined;
};

export default function ChatActions({ chatRoomId, socket }: ChatActionProps) {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState<string>('');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const mesageInputChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value;
    setMessageInput(text);
  };

  const sendMessageHandler = async () => {
    // setSendingMessage(true);
    // // const messageResult = await sendMessage('1231231221', messageInput);
    // const creatorUsername = (await getUser())?.username;
    // const messageResult = await sendMessage(
    //   chatRoomId,
    //   creatorUsername!,
    //   messageInput
    // );
    // if (!messageResult.success) {
    //   setSendingMessage(false);
    //   setErrorMsg(messageResult.error);
    //   return;
    // }
    // setMessageInput('');
    // setSendingMessage(false);

    // router.refresh(); // i think this what causes the bug. Change it to refetch context instead
    if (socket) {
      const user = await getUser();
      const creatorUsername = user!.username;
      const senderUserId = user!.id;
      socket.emit(SEND_MESSAGE, {
        chatRoomId,
        creatorUsername,
        text: messageInput,
        senderUserId,
      });
    }
  };

  useEffect(() => {
    socket?.on(MESSAGE_SUCCESS, (_) => {
      setMessageInput('');
      setSendingMessage(false);
    });
    socket?.on(MESSAGE_FAILED, (_) => {
      console.log('here');
      setErrorMsg('Fail to send message.');
      setSendingMessage(false);
    });
  }, []);

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
          <div className='flex items-center'>
            {/* Share file icon */}
            <svg
              className='w-6 h-6 text-blue '
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                fillRule='evenodd'
                d='M9 2.2V7H4.2l.4-.5 3.9-4 .5-.3Zm2-.2v5a2 2 0 0 1-2 2H4v11c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='w-full'>
            <Textarea
              onChange={(e) => mesageInputChangeHandler(e)}
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
