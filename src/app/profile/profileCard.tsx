'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Label,
  Modal,
  TextInput,
  Textarea,
} from 'flowbite-react';
import ChatAvatar from '../ui/chatAvatar';
import { buttonPrimary } from '../ui/buttonTheme';
import { updateUserStatus, updateUsername } from '../lib/actions';
import { User } from '../lib/definitions';

type ProfileCardProps = {
  user: User;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  const { username, id: userId, status } = user;
  const router = useRouter();

  // UI States
  const [usernameModal, setUsernameModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{
    text: string;
    type: 'info' | 'success' | 'failure';
  }>({ text: '', type: 'info' });

  // Input states
  const [usernameEditing, setUsernameEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const [statusEditing, setStatusEditing] = useState(false);
  const [statusInput, setStatusInput] = useState(status);

  const usernameEditHandler = async () => {
    setUsernameEditing(false);
    setUsernameModal(false);

    if (usernameInput.length === 0) {
      // alert('Username cannot be empty!');
      setAlertMsg({
        text: 'Username cannot be empty!',
        type: 'failure',
      });
      setOpenAlert(true);
      return;
    }

    const updateResponse = await updateUsername(userId, usernameInput.trim());
    const updateSuccess = updateResponse.success;

    if (!updateSuccess) {
      // alert('Username update failed');
      setAlertMsg({
        text: 'Username update failed!',
        type: 'failure',
      });
      setOpenAlert(true);

      return;
    }

    // alert('Username updated!');
    setAlertMsg({
      text: 'Username updated!',
      type: 'success',
    });
    setOpenAlert(true);

    // refresh the page
    router.refresh();
  };

  const statusEditHandler = async () => {
    setUsernameEditing(false);
    setUsernameModal(false);

    const updateResponse = await updateUserStatus(userId, statusInput.trim());
    const updateSuccess = updateResponse.success;

    if (!updateSuccess) {
      // alert('Username update failed');
      setAlertMsg({
        text: 'Status update failed!',
        type: 'failure',
      });
      setOpenAlert(true);

      return;
    }

    // alert('Username updated!');
    setAlertMsg({
      text: 'Status updated!',
      type: 'success',
    });
    setOpenAlert(true);

    // refresh the page
    router.refresh();
  };

  useEffect(() => {
    const alertTimeout = setTimeout(() => {
      setOpenAlert(false);
    }, 5000);
    return () => {
      clearTimeout(alertTimeout);
    };
  }, [openAlert, setOpenAlert]);

  return (
    <>
      {openAlert && (
        <Alert
          onClick={() => setOpenAlert(false)}
          color={alertMsg.type}
          className='mx-3 flex'
          hidden={true}
        >
          {alertMsg.text}
        </Alert>
      )}
      {/* Username update modal */}
      <Modal
        show={usernameModal}
        size='md'
        onClose={() => setUsernameModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200'>
              <svg
                className='w-full h-full text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 13V8m0 8h0m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </div>
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              Are you sure you want to update username?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='success' onClick={() => usernameEditHandler()}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setUsernameModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Status update modal */}
      <Modal
        show={statusModal}
        size='md'
        onClose={() => setStatusModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200'>
              <svg
                className='w-full h-full text-gray-800 dark:text-white'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 13V8m0 8h0m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </div>
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              Are you sure you want to update status?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='success' onClick={() => statusEditHandler()}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setStatusModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Card className='mx-5 my-10 min-h-[50vh]'>
        <div className='mx-auto text-center'>
          <ChatAvatar username={username} size={100} />
          <p className='mt-3 text-xl font-bold'>{username}</p>
          <p className='text-xs text-gray-500'>{status}</p>
        </div>
        <div>
          <form>
            <div className='mb-2 block'>
              <Label
                htmlFor='username'
                value='Username'
                className='font-bold'
              />
            </div>
            <TextInput
              onChange={(e) => setUsernameInput(e.target.value)}
              id='username'
              value={usernameInput}
              disabled={!usernameEditing}
            />

            <div className='flex gap-3'>
              {!usernameEditing && (
                <Button
                  onClick={() => setUsernameEditing(true)}
                  className='mt-3'
                  theme={buttonPrimary}
                  color='blue'
                  type='button'
                >
                  Edit Username
                </Button>
              )}

              {usernameEditing && (
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
              )}
            </div>
          </form>
          <form>
            <div className='mt-10 mb-2 block'>
              <Label htmlFor='Status' value='Status' className='font-bold' />
            </div>
            <Textarea
              onChange={(e) => setStatusInput(e.target.value)}
              id='Status'
              placeholder='Leave a Status...'
              required
              value={statusInput}
              rows={5}
              disabled={!statusEditing}
            />
            <div className='flex gap-3'>
              {!statusEditing && (
                <Button
                  onClick={() => setStatusEditing(true)}
                  className='mt-3'
                  theme={buttonPrimary}
                  color='blue'
                  type='button'
                >
                  Edit Status
                </Button>
              )}

              {statusEditing && (
                <>
                  <Button
                    onClick={() => setStatusModal(true)}
                    className='mt-3'
                    color='success'
                    type='button'
                  >
                    Confirm Edit
                  </Button>
                  <Button
                    onClick={() => setStatusEditing(false)}
                    color='failure'
                    className='mt-3'
                    type='button'
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </Card>
    </>
  );
}
