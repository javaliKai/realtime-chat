'use client';

import { Group, GroupMessage } from '@/app/lib/definitions';
import GroupChatTag from './groupChatTag';
import { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import GroupChatActions from './groupChatActions';
import GroupChatBody from './groupChatBody';
import { JOIN_GROUP_ROOM, POPULATE_GROUP_CHAT } from '@/app/lib/socketEvents';
import GroupChatContext, {
  GroupChatContextProvider,
} from '@/app/store/groupContext';

type GroupSocketProps = {
  group: Group;
  totalMember: number;
  currentUserId: string;
  messages: { [key: string]: GroupMessage[] };
};

export default function GroupSocket({
  group,
  totalMember,
  currentUserId,
  messages,
}: GroupSocketProps) {
  return (
    <>
      <GroupChatContextProvider>
        <GroupSocketComponent
          group={group}
          totalMember={totalMember}
          currentUserId={currentUserId}
          messages={messages}
        />
      </GroupChatContextProvider>
    </>
  );
}

const GroupSocketComponent = ({
  group,
  totalMember,
  currentUserId,
  messages,
}: GroupSocketProps) => {
  const groupChatContext = useContext(GroupChatContext);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const socket = io('http://localhost:3500');

    socket.on('connect', () => {
      // @ts-ignore
      setSocket(socket);
      console.log('Socket connected for group from ID: ' + socket.id);
      socket.emit(JOIN_GROUP_ROOM, { groupId: group.id });
    });

    socket.on(POPULATE_GROUP_CHAT, async (groupRoomData) => {
      await groupChatContext.getGroupRoom(group.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <GroupChatTag
        groupName={group.group_name}
        groupId={group.id}
        totalMember={totalMember}
      />
      <div className='min-h-[70vh]'>
        <GroupChatBody
          currentUserId={currentUserId}
          messages={groupChatContext.messages}
        />
      </div>
      <GroupChatActions groupId={group.id} socket={socket} />
    </>
  );
};
