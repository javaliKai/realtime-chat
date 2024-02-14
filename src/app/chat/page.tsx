import { protectedPage } from '../lib/helpers';
import ChatActions from './chatActions';
import ChatBody from './chatBody';
import ChatTag from './chatTag';

export default function Chat() {
  // protectedPage();
  return (
    <>
      {/* Chat Tag (Header) */}
      <ChatTag />
      <hr />
      {/* Chat Body */}
      <ChatBody />
      {/* Chat Actions */}
      <ChatActions />
    </>
  );
}
