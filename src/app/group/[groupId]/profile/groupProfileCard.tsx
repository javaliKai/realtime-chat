'use client';

import { Participant } from '@/app/lib/definitions';
import { buttonPrimary } from '@/app/ui/buttonTheme';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Button, Card, Label, ListGroup, TextInput } from 'flowbite-react';
import { useState } from 'react';

type GroupProfileCardProps = {
  groupName: string;
  groupSlug: string;
  participants: Participant[];
};

export default function GroupProfileCard({
  groupName,
  groupSlug,
  participants,
}: GroupProfileCardProps) {
  const [nameEdit, setNameEdit] = useState({
    isEditing: false,
    groupName,
  });

  console.log(participants);

  return (
    <Card className='mx-5 my-10 min-h-[50vh]'>
      <div className='mx-auto text-center'>
        <ChatAvatar username={groupName} size={100} />
        <p className='mt-3 text-xl font-bold'>{groupName}</p>
      </div>
      <div>
        <form>
          <div className='mb-2 block'>
            <Label
              htmlFor='groupName'
              value='Group Name'
              className='font-bold'
            />
          </div>
          <TextInput
            // onChange={(e) => setUsernameInput(e.target.value)}
            id='groupName'
            value={nameEdit.groupName}
            disabled={!nameEdit.isEditing}
          />

          <div className='flex gap-3'>
            {!nameEdit.isEditing && (
              <Button
                // onClick={() => setnameEdit(true)}
                className='mt-3'
                theme={buttonPrimary}
                color='blue'
                type='button'
              >
                Edit Group Name
              </Button>
            )}
          </div>
        </form>
        <div className='mt-5'>
          <span>Group Slug: </span>
          <br />
          <span className='font-bold text-xl'>{groupSlug}</span>
        </div>
      </div>
      <div className='mt-5'>
        <h3 className='text-lg'>Participants: </h3>
        <ListGroup className=''>
          {participants.map((user) => (
            <ListGroup.Item key={user.id}>
              <ChatAvatar username={user.username} size={50} />
              <span className='ml-3'>{user.username}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Card>
  );
}
