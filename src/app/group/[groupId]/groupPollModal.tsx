'use client';

import { createPoll } from '@/app/lib/actions';
import GroupChatContext from '@/app/store/groupContext';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';

type GroupPollModalProps = {
  showPollModal: boolean;
  setPollModal: (state: boolean) => void;
};

export default function GroupPolllModal({
  showPollModal,
  setPollModal,
}: GroupPollModalProps) {
  const { groupId } = useContext(GroupChatContext);
  const [feedback, setFeedback] = useState<string>('');
  const pollNameRef = useRef<HTMLInputElement>(null);

  const createPollHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const pollName = pollNameRef.current?.value;

    const result = await createPoll(pollName!, groupId);

    if (result.error) {
      setFeedback(result.error);
    } else {
      setFeedback('Poll created!');
      setPollModal(false);
      pollNameRef.current!.value = '';
    }
  };

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
