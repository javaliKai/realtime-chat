import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { buttonPrimary } from './ui/buttonTheme';
import Header from './ui/header';
import FooterLayout from './ui/footer';

/** This is the landing page */
export default function Home() {
  return (
    <>
      <Header />
      <main className='container p-3 min-w-[100vw]'>
        <section className='lg:flex sm:block min-h-[80vh]'>
          <div className='py-[7rem] md:py-[10rem] px-[5rem] '>
            <h2 className='text-4xl font-bold leading-relaxed'>
              Connect <span className='text-blue'>Instantly</span>, <br /> Chat
              Seamlessly
            </h2>
            <p className='my-8 text-sm leading-normal'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum
              deserunt, esse voluptate suscipit libero dolor dicta asperiores,
              veniam possimus perspiciatis nemo dolorum saepe rerum quam.
            </p>
            <Button className='z-[-1]' pill theme={buttonPrimary} color='blue'>
              <Link href='/auth/login' className='font-bold'>
                Get Started
              </Link>
            </Button>
          </div>
          <div className='flex items-center justify-center p-5 md:w-[100%] sm:w-[45%]'>
            <Image
              src='./group_chat.svg'
              alt='group chat image'
              width='500'
              height='760'
            />
          </div>
        </section>
      </main>
      <FooterLayout />
    </>
  );
}
