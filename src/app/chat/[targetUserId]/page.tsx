import { getUser, openChatRoom } from '@/app/lib/actions';
import { protectedPage } from '../../lib/helpers';
import { notFound } from 'next/navigation';
import ChatSocket from './chatSocket';

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
      <ChatSocket
        chatProps={{
          receiver: chatRoom.receiver,
          messages: chatRoom.messages,
          currentUserId: userId,
          targetUserId: params.targetUserId,
          chatRoomId: chatRoom.id,
        }}
      />
    </>
  );
}
