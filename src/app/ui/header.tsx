import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { buttonPrimary } from './buttonTheme';

import { UserSession } from '../lib/definitions';
import { getUserSession } from '../lib/helpers';
import LogoutButton from './logout';
import MobileNav from './mobileNav';

export default async function Header() {
  let userSession = getUserSession();

  return (
    <header className=' flex justify-between py-5 px-8'>
      <Link href='/' className='flex items-center gap-2'>
        <Image
          src='/chat_icon.svg'
          alt='Liaoliao logo'
          width='30'
          height='30'
        />
        <h1 className='text-3xl font-bold text-blue'>Liaoliao</h1>
      </Link>
      {/* Mobile nav */}
      <nav className=''>
        <MobileNav />
      </nav>
      <nav className='hidden flex gap-7 items-center'>
        <a
          href='#'
          className='transition-colors hover:text-blue hover:underline'
        >
          Home
        </a>
        <a
          href='#'
          className='transition-colors hover:text-blue hover:underline'
        >
          About
        </a>
        {!userSession && (
          <Link href='/auth/login' className='font-bold'>
            <Button pill theme={buttonPrimary} color='blue'>
              Login
            </Button>
          </Link>
        )}
        {!!userSession && <LogoutButton />}
      </nav>
    </header>
  );
}
