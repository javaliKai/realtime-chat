import { getUserSession, protectedPage } from '../lib/helpers';
import ChatHeader from './chatHeader';
import ChatCard from './chatCard';
import { redirect } from 'next/navigation';
import { getUser } from '../lib/actions';

/** List out all messages */
export default async function Page() {
  // Get user info from db
  const user = await getUser();
  if (!user) {
    return redirect('/auth/login');
  }

  return (
    <>
      {/* Loop over friends list */}
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
      <ChatCard username={user.username} />
    </>
  );
}
