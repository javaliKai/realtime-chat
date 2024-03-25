'use client';

import axios from 'axios';
import Image from 'next/image';
import { useEffect } from 'react';

type FileChatItemProps = {
  fileName: string;
};

export default function FileChatItem({ fileName }: FileChatItemProps) {
  const isPdf = fileName.split('.')[3] === 'pdf';

  return (
    <>
      <a
        href={fileName}
        target='_blank'
        className='cursor-pointer break-words hover:underline hover:text-blue'
      >
        {isPdf ? (
          fileName
        ) : (
          <Image src={fileName} alt='chatImage' width={250} height={250} />
        )}
      </a>
    </>
  );
}
