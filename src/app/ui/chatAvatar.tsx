import Avatar from 'react-avatar';

type ChatAvatarProps = {
  username: string;
  size?: number | undefined;
};

export default function ChatAvatar({ username, size }: ChatAvatarProps) {
  return <Avatar name={username} size='50' round />;
}
