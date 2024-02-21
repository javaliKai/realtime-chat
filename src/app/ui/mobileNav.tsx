'use client';

import { useState } from 'react';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { buttonPrimary } from './buttonTheme';

export default function MobileNav() {
  const [showSidenav, setShowSidenav] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowSidenav(true)}
        className='p-1 border border-gray-200 rounded hover:bg-gray-200 focus:bg-gray-200 transition'
      >
        <svg
          className='w-7 h-7 text-gray-800'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='2'
            d='M5 7h14M5 12h14M5 17h14'
          />
        </svg>
      </div>

      {showSidenav && (
        <>
          {/* Background layer */}
          <div className='absolute min-h-[120vh] min-w-[100vw] z-[99] bg-black opacity-25 top-0 left-0'></div>
          <div
            onClick={() => setShowSidenav(false)}
            className='absolute top-0 right-0 min-h-[120vh] z-[100] w-[200px] bg-whitebg py-5 px-3'
          >
            <div className='flex justify-end'>
              <span className='hover:bg-gray-200 rounded-2xl p-2 transition'>
                {/* Back button */}
                <svg
                  className='w-6 h-6 text-gray-800 dark:text-white'
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
                    d='M19 12H5m14 0-4 4m4-4-4-4'
                  />
                </svg>
              </span>
            </div>
            <ul>
              <li>
                <Link
                  href='/'
                  className='transition-colors hover:text-blue hover:underline'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='transition-colors hover:text-blue hover:underline'
                >
                  About
                </Link>
              </li>
              <li className='mt-5'>
                <Link href='/auth/login' className='font-bold'>
                  <Button theme={buttonPrimary} color='blue' fullSized>
                    Login
                  </Button>
                </Link>
                {/* {!userSession && (
                <Link href='/auth/login' className='font-bold'>
                  <Button pill theme={buttonPrimary} color='blue'>
                    Login
                  </Button>
                </Link>
              )}
              {!!userSession && <LogoutButton />} */}
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
