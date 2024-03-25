'use client';

import { joinGroup } from '@/app/lib/actions';
import { Alert, Button, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';

type JoinGroupModalProps = {
  showJoinModal: boolean;
  setJoinModal: (status: boolean) => void;
};

export default function JoinGroupModal({
  showJoinModal,
  setJoinModal,
}: JoinGroupModalProps) {
  const groupSlugRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: string; message: string }>({
    type: 'failure',
    message: '',
  });

  const joinGroupHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const groupSlug = groupSlugRef.current?.value;
    const result = await joinGroup(groupSlug!);
    if (result.success) {
      setFeedback({ type: 'success', message: 'Successfully joined a group!' });
      groupSlugRef.current!.value = '';
    } else {
      setFeedback({ type: 'failure', message: result.error });
    }
  };

  useEffect(() => {
    const feedbackTimeout = setTimeout(() => {
      setFeedback({ type: 'failure', message: '' });
    }, 3000);
    return () => {
      clearTimeout(feedbackTimeout);
    };
  }, [feedback]);

  return (
    <Modal
      show={showJoinModal}
      size='md'
      onClose={() => setJoinModal(false)}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        {feedback.message && (
          <>
            <Alert color={feedback.type} className='mb-2'>
              <span className='font-medium'>{feedback.message}</span>
            </Alert>
          </>
        )}
        <form onSubmit={(e) => joinGroupHandler(e)}>
          <h3 className='font-bold'>Join a Group</h3>
          <hr />
          <div className='mb-2 mt-2 block'>
            <Label htmlFor='small' value='Group Slug' />
          </div>
          <TextInput
            ref={groupSlugRef}
            id='small'
            type='text'
            sizing='sm'
            required
          />
          <div className='mt-5 flex gap-4'>
            <Button color='success' size='sm' type='submit'>
              Join
            </Button>
            <Button onClick={() => setJoinModal(false)} color='gray' size='sm'>
              Cancel
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
