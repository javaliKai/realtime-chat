import { getUser, openGroupRoom } from '@/app/lib/actions';
import { protectedPage } from '@/app/lib/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import GroupProfileCard from './groupProfileCard';
import GroupProfile from './groupProfile';

type PageProps = {
  params: {
    groupId: string;
  };
};

export default async function Page({ params }: PageProps) {
  protectedPage();

  const groupRoomData = await openGroupRoom(params.groupId);
  // console.log(groupRoom);

  if (!groupRoomData.group) {
    return notFound();
  }

  return <GroupProfile group={groupRoomData.group} />;
}
