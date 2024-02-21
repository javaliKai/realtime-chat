'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/app/lib/actions';
import { buttonPrimary } from '@/app/ui/buttonTheme';
import { Alert, Button, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button
      pill
      theme={buttonPrimary}
      color='blue'
      className='w-full'
      // disabled={pending}
      type='submit'
      disabled={pending}
    >
      {pending ? <Spinner size='md' /> : 'Sign In'}
    </Button>
  );
}

export default function LoginForm() {
  const router = useRouter();

  const loginHandler = async (
    prevState: string | undefined,
    formData: FormData
  ) => {
    const userObj = await loginAction(formData);
    if (!userObj) {
      return 'Login failed.';
    }

    // redirect the user
    router.push('/main');
    router.refresh();

    return 'Login on process';
  };

  const [errorMesage, formAction] = useFormState(loginHandler, undefined);

  return (
    <form
      action={formAction}
      className='flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl'
    >
      <div className='mb-3'>
        {errorMesage && <Alert color='failure'>{errorMesage}</Alert>}
      </div>
      <h3 className='mb-3 text-4xl font-extrabold text-dark-grey-900'>
        Sign In
      </h3>
      <p className='mb-4 text-grey-700'>Enter your username and password</p>
      <label
        htmlFor='username'
        className='mb-2 text-sm text-start text-grey-900'
      >
        Username*
      </label>
      <input
        name='username'
        required
        id='username'
        type='text'
        placeholder='username'
        className='flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
      />
      <label
        htmlFor='password'
        className='mb-2 text-sm text-start text-grey-900'
      >
        Password*
      </label>
      <input
        name='password'
        required
        id='password'
        type='password'
        placeholder='password'
        className='flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
      />
      <div className='flex items-center mb-8 text-left'>
        <input
          id='default-checkbox'
          type='checkbox'
          className='w-4 h-4 bg-gray-100 border-gray-300 rounded outline-none cursor-pointer'
        />
        <label htmlFor='default-checkbox' className='ms-2 text-sm'>
          Keep Logged In
        </label>
      </div>
      <Submit />
      <p className='text-sm leading-relaxed text-grey-900'>
        Not registered yet?{' '}
        <Link
          href='/auth/register'
          className='font-bold text-grey-700 hover:underline'
        >
          Create an Account
        </Link>
      </p>
    </form>
  );
}
