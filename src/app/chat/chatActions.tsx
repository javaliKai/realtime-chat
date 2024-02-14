import { Button, TextInput, Textarea } from 'flowbite-react';
import { buttonPrimary } from '../ui/buttonTheme';

export default function ChatActions() {
  return (
    <>
      <div className='w-full px-3 py-5 fixed bottom-0 border-y-2'>
        <div className='flex gap-5'>
          <div className='flex items-center bg-blue rounded-lg p-2'>
            {/* Share file icon */}
            <svg
              className='w-6 h-6 text-white'
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
              placeholder='Type a message'
              rows={2}
              style={{ resize: 'none' }}
            />
          </div>
          <div className='flex items-center'>
            <Button theme={buttonPrimary} color='blue'>
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
