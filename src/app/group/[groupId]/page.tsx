import { protectedPage } from '@/app/lib/helpers';
import { getUser, openGroupRoom } from '@/app/lib/actions';
import GroupSocket from './groupSocket';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    groupId: string;
  };
};

export default async function Page({ params }: PageProps) {
  protectedPage();

  const currentUser = await getUser();
  const userId = currentUser?.id;
  const groupRoomData = await openGroupRoom(params.groupId);

  if (!groupRoomData.group) {
    return notFound();
  }

  return (
    <>
      <GroupSocket
        group={groupRoomData.group}
        totalMember={groupRoomData.totalMember}
        currentUserId={userId!}
        messages={groupRoomData.messages}
      />
    </>
  );
}
