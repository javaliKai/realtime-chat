import { createContext, useState } from 'react';
import { Group, Message, Participant, User } from '../lib/definitions';
import { openGroupRoom } from '../lib/actions';

type GroupChatContextType = {
  groupId: string;
  totalMember: number;
  participants: Participant[];
  messages: { [key: string]: Message[] };
  loading: boolean;
  getGroupRoom: (groupId: string) => Promise<boolean> | void;
};

const GroupChatContext = createContext<GroupChatContextType>({
  groupId: '',
  totalMember: 0,
  participants: [] as Participant[],
  messages: {},
  loading: true,
  getGroupRoom: (groupId) => {},
});

export const GroupChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<{
    groupId: string;
    totalMember: number;
    participants: Participant[];
    messages: { [key: string]: Message[] };
    loading: boolean;
  }>({
    groupId: '',
    totalMember: 0,
    messages: {},
    participants: [],
    loading: true,
  });

  const getGroupRoom = async (groupId: string) => {
    const groupRoom = await openGroupRoom(groupId);
    if (groupRoom.error) {
      return false;
    }

    setData((_) => {
      return {
        groupId: groupRoom.group.id,
        totalMember: groupRoom.totalMember,
        participants: groupRoom.participants,
        messages: groupRoom.messages,
        loading: false,
      };
    });

    return true;
  };

  return (
    <GroupChatContext.Provider
      value={{
        ...data,
        getGroupRoom,
      }}
    >
      {children}
    </GroupChatContext.Provider>
  );
};

export default GroupChatContext;
