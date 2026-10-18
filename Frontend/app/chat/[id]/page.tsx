'use client';


import ChatComponent from '@/app/Components/ChatComponent';

import { useParams } from 'next/navigation';
import Loading from './loading';
import { useEffect, useState } from 'react';

const ChatPage = () => {
  const { id } = useParams();
  const roomId = String(id);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50); // Simulate a loading delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loading /> : <ChatComponent roomId={roomId} />}
    </>
  );
};

export default ChatPage;