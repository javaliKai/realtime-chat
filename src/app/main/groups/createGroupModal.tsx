'use client';

import { createGroup, getUser } from '@/app/lib/actions';
import { AlertState } from '@/app/lib/definitions';
import { getUserSession } from '@/app/lib/helpers';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type CreateGroupModalProps = {
  showCreateModal: boolean;
  setCreateModal: (status: boolean) => void;
};

export default function CreateGroupModal({
  showCreateModal,
  setCreateModal,
}: CreateGroupModalProps) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>('');

  const createGroupHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const groupName = groupNameRef.current?.value;
    const leaderId = (await getUser())?.id;
    console.log('Creating group: ', groupName, leaderId);

    if (!leaderId) {
      return;
    }

    const result = await createGroup(leaderId, groupName!);
    if (result.success) {
      setFeedback('Group has been created.');
      groupNameRef.current!.value = '';
    } else {
      setFeedback(result.error);
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
    <Modal
      show={showCreateModal}
      size='md'
      onClose={() => {
        setCreateModal(false);
        setFeedback('');
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div>
          <h3 className='font-bold'>Create a Group</h3>
          <hr />
          {feedback && (
            <span className='text-xs color-gray-500'>{feedback}</span>
          )}
          <form onSubmit={(e) => createGroupHandler(e)} className='mt-2'>
            <div className='mb-2 block'>
              <Label htmlFor='small' value='Group Name' />
            </div>
            <TextInput
              ref={groupNameRef}
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
                onClick={() => setCreateModal(false)}
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
  );
}
