import { createContext, useState } from 'react';
import { FriendRequestInfo } from '../lib/definitions';
import { getAllUserFriendRequests } from '../lib/actions';

type NotificationContextType = {
  friendRequests: FriendRequestInfo[];
  fetchFriendRequests: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  friendRequests: [],
  fetchFriendRequests: () => {},
});

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequestInfo[]>([]);
  const fetchFriendRequests = async () => {
    const response = await getAllUserFriendRequests();
    if (!response.error) {
      const friendReqData = response.friendRequests;
      setFriendRequests(friendReqData);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        friendRequests,
        fetchFriendRequests,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
