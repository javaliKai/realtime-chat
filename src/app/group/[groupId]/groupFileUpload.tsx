'use client';

import { useState } from 'react';
import GroupFileUploadModal from './groupFileUploadModal';

export default function GroupFileUpload() {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  return (
    <>
      <GroupFileUploadModal
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
      />
      <div
        onClick={() => setShowUploadModal(true)}
        className='flex items-center cursor-pointer'
      >
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
    </>
  );
}
