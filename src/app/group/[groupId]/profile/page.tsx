import { openGroupRoom } from '@/app/lib/actions';
import { protectedPage } from '@/app/lib/helpers';
import { notFound } from 'next/navigation';
import GroupProfile from './groupProfile';

type PageProps = {
  params: {
    groupId: string;
  };
};

export default async function Page({ params }: PageProps) {
  protectedPage();

  const groupRoomData = await openGroupRoom(params.groupId);

  if (!groupRoomData.group) {
    return notFound();
  }

  return (
    <GroupProfile
      group={groupRoomData.group}
      participants={groupRoomData.participants}
    />
  );
}
