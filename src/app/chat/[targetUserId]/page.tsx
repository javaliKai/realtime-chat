import { getUser, openChatRoom } from '@/app/lib/actions';
import { getUserSession, protectedPage } from '../../lib/helpers';
import ChatActions from './chatActions';
import ChatBody from './chatBody';
import ChatTag from './chatTag';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    targetUserId: string;
  };
};

export default async function Chat({ params }: PageProps) {
  protectedPage();

  // fetch the chat room data
  const currentUser = await getUser();
  const userId = currentUser?.id;
  const chatRoom = await openChatRoom(params.targetUserId);
  // console.log(chatRoom);

  if (chatRoom.error) {
    return notFound();
  }

  return (
    <>
      {/* Chat Tag (Header) */}
      <ChatTag receiver={chatRoom.receiver} />
      <hr />
      {/* Chat Body */}
      <ChatBody messages={chatRoom.messages} currentUserId={userId} />
      {/* Chat Actions */}
      <ChatActions chatRoomId={chatRoom.id} />
    </>
  );
}
