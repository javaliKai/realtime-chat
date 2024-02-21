'use client';

import { registerAction } from '@/app/lib/actions';
import { buttonPrimary } from '@/app/ui/buttonTheme';
import { Alert, Spinner } from 'flowbite-react';
import { Button } from 'flowbite-react/lib/esm/components/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

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
      {pending ? <Spinner size='md' /> : 'Register'}
    </Button>
  );
}

export default function RegisterForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const registerHandler = async (_: string | undefined, formData: FormData) => {
    const registerRes = await registerAction(formData);
    if (registerRes?.error) return `Register failed: ${registerRes!.error}`;
    setIsSuccess(true);
    return 'Register success!';
  };

  const [errorMesage, formAction] = useFormState(registerHandler, undefined);

  return (
    <form
      action={formAction}
      className='flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl'
    >
      <div className='mb-3'>
        {errorMesage && (
          <Alert color={isSuccess ? 'success' : 'failure'}>{errorMesage}</Alert>
        )}
      </div>{' '}
      <h3 className='mb-3 text-4xl font-extrabold text-dark-grey-900'>
        Create Account
      </h3>
      <p className='mb-4 text-grey-700'>Fill in your credentials</p>
      <label
        htmlFor='username'
        className='mb-2 text-sm text-start text-grey-900'
      >
        Username*
      </label>
      <input
        required
        name='username'
        id='username'
        type='text'
        placeholder='Johndoe77'
        className='flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
      />
      <label
        htmlFor='password'
        className='mb-2 text-sm text-start text-grey-900'
      >
        Password*
      </label>
      <input
        required
        name='password'
        id='password'
        type='password'
        minLength={6}
        placeholder='Enter a password'
        className='flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
      />
      <label
        htmlFor='repassword'
        className='mb-2 text-sm text-start text-grey-900'
      >
        Retype Password*
      </label>
      <input
        required
        name='repassword'
        id='repassword'
        type='password'
        minLength={6}
        placeholder='Enter password again'
        className='flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl'
      />
      <Submit />
      <p className='text-sm leading-relaxed text-grey-900'>
        Already have an account?{' '}
        <Link href='/auth/login' className='font-bold text-grey-700'>
          Login
        </Link>
      </p>
    </form>
  );
}
