'use client';

import { getPollInfo, getUser, submitVote } from '@/app/lib/actions';
import { GroupPoll } from '@/app/lib/definitions';
import { SEND_VOTE } from '@/app/lib/socketEvents';
import GroupChatContext from '@/app/store/groupContext';
import { Alert, Button, Label, Progress, Radio } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

type GroupPollDisplay = {
  pollId: string;
  socket: Socket;
};

export default function GroupPollDisplay({ pollId, socket }: GroupPollDisplay) {
  const { groupId } = useContext(GroupChatContext);
  const [pollObj, setPollObj] = useState<GroupPoll>({} as GroupPoll);
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: string;
    message: string;
  }>({
    type: 'failure',
    message: '',
  });
  const [selectedOption, setSelectedOption] = useState<string>('agree');

  const voteSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // record vote submission to db through socket
    const user = await getUser();
    const userId = user?.id;
    const decisionBoolean = selectedOption === 'agree';

    socket.emit(SEND_VOTE, { groupId, pollId, userId, decisionBoolean });

    // const result = await submitVote(pollId, decisionBoolean);
    // if (result.error) {
    //   setFeedback({
    //     type: 'failure',
    //     message: result.error,
    //   });
    // } else {
    //   setFeedback({
    //     type: 'success',
    //     message: 'Vote submitted!',
    //   });
    // }
  };

  useEffect(() => {
    const getPoll = async () => {
      const result = await getPollInfo(pollId, groupId);
      if (result.error) {
        setError(result.error);
      } else {
        setPollObj(result.pollObj);
      }
    };

    getPoll();
  }, []);

  useEffect(() => {
    const feedbackTimeout = setTimeout(() => {
      setFeedback({ type: 'failure', message: '' });
    }, 3000);
    return () => {
      clearTimeout(feedbackTimeout);
    };
  }, [feedback]);

  // calculating agree and disagree progress
  let agreeProgress = 0;
  let disagreeProgress = 0;
  const pollEmpty = Object.keys(pollObj).length === 0;
  if (!pollEmpty) {
    agreeProgress = Number(
      ((pollObj.agreeCount / pollObj.totalRespondent) * 100).toFixed(2)
    );
    disagreeProgress = Number(
      ((pollObj.disagreeCount / pollObj.totalRespondent) * 100).toFixed(2)
    );
  }

  if (error) {
    return <p className='text-red-500'>{error}!</p>;
  }

  return (
    <>
      {feedback.message && (
        <Alert className='fixed right-3 top-[2rem]' color={feedback.type}>
          {feedback.message}
        </Alert>
      )}
      {pollObj && (
        <div className='p-3 text-sm'>
          <h3 className='text-xl font-bold text-center mb-5'>Group Poll</h3>
          <p className='break-words'>
            Title: <strong>{pollObj.title}</strong>
          </p>
          <p className='break-words text-left'>
            Created by: {pollObj.creator_username}
          </p>
          <form onSubmit={voteSubmitHandler}>
            <fieldset className='flex max-w-md flex-col gap-4 mt-5 mb-3'>
              <legend className='mb-4'>Choose your decision: </legend>
              <div className='flex items-center gap-2'>
                <Radio
                  id='agree'
                  value='agree'
                  checked={selectedOption === 'agree'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <Label htmlFor='agree'>Agree</Label>
              </div>
              <div className='flex items-center gap-2'>
                <Radio
                  id='disagree'
                  value='disagree'
                  checked={selectedOption === 'disagree'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <Label htmlFor='disagree'>Disagree</Label>
              </div>
              <Button size='sm' type='submit'>
                Vote
              </Button>
            </fieldset>
          </form>
          <div className='flex gap-3 flex-col text-xs'>
            <Progress
              className='bg-white text-xs'
              progress={agreeProgress}
              textLabel='Agree'
              progressLabelPosition='outside'
              textLabelPosition='outside'
              size='sm'
              labelProgress
              labelText
            />
            <Progress
              className='bg-white text-xs'
              progress={disagreeProgress}
              textLabel='Disagree'
              progressLabelPosition='outside'
              textLabelPosition='outside'
              size='sm'
              labelProgress
              labelText
            />
          </div>
        </div>
      )}
    </>
  );
}
