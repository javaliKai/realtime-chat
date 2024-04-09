'use client';

import { createPoll, getUser } from '@/app/lib/actions';
import {
  CREATE_POLL,
  CREATE_POLL_FAILED,
  CREATE_POLL_SUCCESS,
} from '@/app/lib/socketEvents';
import GroupChatContext from '@/app/store/groupContext';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

type GroupPollModalProps = {
  showPollModal: boolean;
  setPollModal: (state: boolean) => void;
  socket: Socket | undefined;
};

export default function GroupPolllModal({
  showPollModal,
  setPollModal,
  socket,
}: GroupPollModalProps) {
  const { groupId } = useContext(GroupChatContext);
  const [feedback, setFeedback] = useState<string>('');
  const pollNameRef = useRef<HTMLInputElement>(null);

  const createPollHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const pollName = pollNameRef.current?.value;
    const user = await getUser();
    const userId = user?.id;
    const creatorUsername = user?.username;

    socket?.emit(CREATE_POLL, { pollName, groupId, userId, creatorUsername });
  };

  useEffect(() => {
    socket?.on(CREATE_POLL_FAILED, (result) => {
      setFeedback(result.error);
    });

    socket?.on(CREATE_POLL_SUCCESS, (_) => {
      setFeedback('Poll created!');
      setPollModal(false);
      pollNameRef.current!.value = '';
    });
  }, [socket]);

  useEffect(() => {
    const feedbackTiemout = setTimeout(() => {
      setFeedback('');
    }, 3000);

    return () => {
      clearTimeout(feedbackTiemout);
    };
  }, [feedback]);

  return (
    <>
      <Modal
        show={showPollModal}
        size='md'
        onClose={() => {
          setPollModal(false);
          setFeedback('');
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div>
            <h3 className='font-bold'>Create a Poll</h3>
            <hr />
            {feedback && (
              <span className='text-xs color-gray-500'>{feedback}</span>
            )}
            <form onSubmit={(e) => createPollHandler(e)} className='mt-2'>
              <div className='mb-2 block'>
                <Label htmlFor='small' value='Polling Name' />
              </div>
              <TextInput
                ref={pollNameRef}
                id='small'
                type='text'
                sizing='sm'
                required
              />
              <div className='mt-5 flex gap-4'>
                <Button color='success' size='sm' type='submit'>
                  Create
                </Button>
                <Button
                  onClick={() => setPollModal(false)}
                  color='gray'
                  size='sm'
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
