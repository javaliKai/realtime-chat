'use client';
import { getUser } from '@/app/lib/actions';
import { useEdgeStore } from '@/app/lib/edgestore';
import ChatContext from '@/app/store/chatContext';
import axios from 'axios';
import { Button, Modal } from 'flowbite-react';
import { Dispatch, SetStateAction, useState, useRef, useContext } from 'react';

type FileUploadModalProps = {
  showUploadModal: boolean;
  setShowUploadModal: Dispatch<SetStateAction<boolean>>;
  chatRoomId: string;
};

export default function FileUploadModal({
  showUploadModal,
  setShowUploadModal,
  chatRoomId,
}: FileUploadModalProps) {
  // const [file, setFile] = useState<File | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>('');
  const { getChatRoom, targetUserId } = useContext(ChatContext);
  const { edgestore } = useEdgeStore();

  const sendFileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);

    // extension filter
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file. Can only upload: PDF, JPEG, and PNG');
      return;
    }

    // size filter -- 3MB limit
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Cannot upload file. Maximum file size is 3MB');
      return;
    }

    // upload file to edgestore
    edgestore.publicFiles
      .upload({
        file,
      })
      .then(async (response) => {
        // save identifier to database when request success
        // console.log(response);

        const user = await getUser();
        const creatorUsername = user!.username;
        const senderUserId = user!.id;

        const data = new FormData();
        data.set('chatRoomId', chatRoomId);
        data.set('creatorUsername', creatorUsername);
        data.set('senderUserId', senderUserId);
        data.set('fileName', response.url);

        axios
          .post('/api/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(async (res) => {
            // re populate the chat room
            await getChatRoom(targetUserId);
          })
          .catch((err) => {
            console.log(err);
            setError(err.response.data.message);
          })
          .finally(() => {
            setLoading(false);
            if (fileRef.current) {
              fileRef.current.value = '';
            }
          });
      })
      .catch((err) => {
        console.error(err);
        setError('Fail to upload file.');
      });
  };

  return (
    <Modal
      show={showUploadModal}
      size='md'
      onClose={() => setShowUploadModal(false)}
      popup
    >
      <Modal.Header />
      <Modal.Body className='overflow-hidden'>
        <div className='text-center p-3'>
          {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}
          <p className='mb-3'>Upload File: </p>
          <form
            onSubmit={sendFileHandler}
            className='flex items-center justify-center gap-2'
          >
            <input
              ref={fileRef}
              type='file'
              accept='image/jpeg,image/png,application/pdf'
              // onChange={(e) => setFile(e.target.files?.[0])}
            />
            <Button
              size='sm'
              outline
              color='success'
              disabled={loading}
              type='submit'
            >
              {loading ? 'Uploading...' : 'Send'}
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
