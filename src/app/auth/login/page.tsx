import LoginForm from './form';
import { protectedAuth } from '@/app/lib/helpers';

export default async function Page() {
  protectedAuth();
  return (
    <div className='container bg-white flex flex-col mx-auto rounded-lg pt-12 my-5 max-w-md w-full p-6 rounded-lg shadow-lg'>
      <div className='flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable'>
        <div className='flex items-center justify-center w-full lg:p-5'>
          <div className='flex items-center xl:p-5'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
