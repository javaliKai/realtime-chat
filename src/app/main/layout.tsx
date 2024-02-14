import { redirect } from 'next/navigation';
import { getUserSession, protectedPage } from '../lib/helpers';
import ChatHeader from './chatHeader';
import { getAllUserFriendRequests, getUser } from '../lib/actions';
import { FriendRequest, FriendRequestInfo } from '../lib/definitions';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  protectedPage();
  return (
    <>
      <main className='container min-h-[100vh] bg-white'>
        <ChatHeader />
        <div className='mt-5 max-h-[80vh] overflow-auto'>{children}</div>
      </main>
    </>
  );
}
