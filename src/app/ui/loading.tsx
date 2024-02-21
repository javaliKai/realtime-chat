import { Spinner } from 'flowbite-react';

export default function Loading() {
  return (
    <div className='min-w-[100vw] min-h-[100vh] flex justify-center items-center'>
      <Spinner size='xl' className='text-center' />
    </div>
  );
}
