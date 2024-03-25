'use client';

import { buttonPrimary } from '@/app/ui/buttonTheme';
import ChatAvatar from '@/app/ui/chatAvatar';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

const username = 'Testing Group';

type GroupProfileCardProps = {
  groupName: string;
  groupSlug: string;
};

export default function GroupProfileCard({
  groupName,
  groupSlug,
}: GroupProfileCardProps) {
  const [nameEdit, setNameEdit] = useState({
    isEditing: false,
    groupName,
  });

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

            {/* {usernameEditing && (
              <>
                <Button
                  onClick={() => setUsernameModal(true)}
                  className='mt-3'
                  color='success'
                  type='button'
                >
                  Confirm Edit
                </Button>
                <Button
                  onClick={() => setUsernameEditing(false)}
                  color='failure'
                  className='mt-3'
                  type='button'
                >
                  Cancel
                </Button>
              </>
            )} */}
          </div>
        </form>
        <div className='mt-5'>
          <span>Group Slug: </span>
          <br />
          <span className='font-bold text-xl'>{groupSlug}</span>
        </div>
      </div>
    </Card>
  );
}
