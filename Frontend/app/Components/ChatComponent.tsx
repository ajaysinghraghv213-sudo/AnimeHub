'use client';

import { chat, sendChatMessage, ChatRequest } from '@/app/function/chat';
import { useEffect,  useRef, useState } from 'react';
import { getChatMessages, deleteMessages } from '@/app/function/chatinitials';
import { getChatParticipants } from '@/app/function/getchatparticipants';
import { blockUser, unblockUser, isUserBlocked } from '../function/block_user';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import Link  from 'next/link';
import { useRouter } from 'next/navigation';
interface ChatMessage {
  id?: number | string;
  content: string;
  author?: { id?: number | string; username?: string };
  created_at?: string;
  is_seen?: boolean;
}

interface TypingIndicatorProps {
  isTyping: boolean;
}
interface ChatParticipant {
  id?: number | string;
  username?: string;
  bio?: string;
  profile_pic?: string;
}

interface ChatComponentProps {
  roomId: string;
}



const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [participantsdata, setParticipants] = useState<ChatParticipant[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const startLongPress = (id: string) => {
    longPressTimer.current = setTimeout(() => setMenuMessageId(id), 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };


 function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(query);
        const update = () => setMatches(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [query]);
    return matches;
}

// inside your component
const isDesktop = useMediaQuery("(min-width: 768px)");





  // Dismiss the menu on outside tap or Escape
  useEffect(() => {
    if (menuMessageId === null) return;
    const close = () => setMenuMessageId(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuMessageId]);


  const handleBlockUser = async (userId?: string | number) => {
    if (userId === undefined) return;
    try {
      await blockUser(userId);
      setBlocked(true);
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };


  const handleUnblockUser = async (userId?: string | number) => {
    if (userId === undefined) return;
    try {
      await unblockUser(userId);
      setBlocked(false);
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  const showIsTypingIndicator = (isTyping: boolean) => {
    setIsTyping(isTyping);
    console.log(`User is ${isTyping ? '' : 'not '}typing`);
  };

// scroll to the newest message whenever messages change
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

   
  useEffect(() => {
    setCurrentUserId(localStorage.getItem('user_id'));
    const myId = Number(localStorage.getItem('user_id'));
    const sendSeen = (socketRef: WebSocket, messageId: number | string) => {
      if (socketRef.readyState !== WebSocket.OPEN) return;
      socketRef.send(
        JSON.stringify({
          type: 'seen',
          message_id: Number(messageId),
          is_seen: true,
        }),
      );
    };

    const fetchMessages = async (): Promise<ChatMessage[]> => {
      const data = await getChatMessages(roomId);
      if (!Array.isArray(data)) return [];
      setMessages(data);
      return data;
    };
    const history =  fetchMessages();

    const chatSocket = chat(roomId, {

      onOpen: () => {

      
      
        // Opening the room counts as seeing the other user's unseen messages
        history.then((list) => {
          list.forEach((m) => {
            if (
              m.id !== undefined &&
              !m.is_seen &&
              Number(m.author?.id) !== myId
            ) {
              sendSeen(chatSocket, m.id);
            }
          });
        });
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'typing') {
          showIsTypingIndicator(data.is_typing);
          return;
        }

        if (data.type === 'error' || data.error) {
          setSendError(data.error ?? data.message ?? 'Unable to send message.');
          return;
        }

        if (data.type === 'presence') {
          if (Number(data.user_id) === myId) return;
          const online =
            data.status !== undefined
              ? String(data.status).toLowerCase() === 'online'
              : data.is_online === true;
          setIsOnline(online);
          console.log('presence received:', data);
          return;
        }
        if (data.type === 'message_deleted') {
          console.log('message_deleted received:', data);
          setMessages((prev) => prev.filter((m) => String(m.id) !== String(data.message_id)));
          return;
        }


        if (data.type === 'message_seen') {
          console.log('message_seen received:', data);
          // Ignore receipts produced by the current user (the reader)
          if (Number(data.user_id) === myId || data.is_seen === false) return;

          // Without a message id, treat the receipt as covering all of my messages
          const seenId = data.message_id ?? data.id;
          setMessages((prev) =>
            prev.map((m) =>
              Number(m.author?.id) === myId &&
              (seenId == null || Number(m.id) === Number(seenId))
                ? { ...m, is_seen: true }
                : m,
            ),
          );
          return;
        }
        if (data.type !== 'message') return;

        const incoming: ChatMessage = {
          id: data.id,
          content: data.message,
          author: { id: data.author_id, username: data.author },
          created_at: data.created_at,
        };
        setMessages((prev) => [...prev, incoming]);

        // Acknowledge only messages written by the other participant
        if (Number(data.author_id) !== myId) {
          sendSeen(chatSocket, data.id);
        }
      },
    });
    setSocket(chatSocket);

    return () => {
      chatSocket.onmessage = null;
      chatSocket.close();
      setIsOnline(false);
      setSocket(null);
    };
  }, [roomId]);





  //this is to handle the input change event and manage typing indicator//

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  let value = e.target.value;
  setSendError(null);

  if (value.length > 200) {
    value = value.slice(0, 200);
  }
  setInput(value);

  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  // User started typing
  socket.send(
    JSON.stringify({
      type: "typing",
      is_typing: true,
    })
  );

  // Reset previous timer
  if (typingTimeout.current) {
    clearTimeout(typingTimeout.current);
  }

  // User stopped typing
  typingTimeout.current = setTimeout(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "typing",
          is_typing: false,
        })
      );
    }
  }, 4000);
};

//this is to send live messages to the chat room so everyone can see them in real-time//

  const handleSend = () => {
    if (socket && input.trim()) {
      const request: ChatRequest = { message: input, room_id: roomId };
      if (socket) {
        socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      }
      sendChatMessage(socket, request);
      setInput('');        
    }
  };

  

  //this is to fetch the particpants(which also includes the self user)//

  useEffect(() => {
    const fetchParticipants = async () => {
      const data = await getChatParticipants(roomId);
      const list = Array.isArray(data) ? data : data?.participants;
      if (Array.isArray(list)) {
        setParticipants(list);
        
      }
    };
    fetchParticipants();
  }, [roomId]);
    
  //this is to identify the other participant in the chat (excluding the current user)//
  const otherParticipant = participantsdata.find(
    (p) => String(p.id) !== currentUserId,
  );



  // Restore block state after refresh
  const otherId = otherParticipant?.id;
  useEffect(() => {
    if (otherId === undefined) return;
    isUserBlocked(otherId).then(setBlocked).catch((e) => console.error(e));
  }, [otherId]);

  const handleDeleteMessage = async (message_id: string) => {
    const result = await deleteMessages(roomId, message_id);
    setMenuMessageId(null);
    if (!result) {
      console.error(`Failed to delete message ${message_id}`);
      return;
    }
    setMessages((prev) => prev.filter((m) => String(m.id) !== message_id));
    // Tell the other participant's client to drop it too
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "message_deleted",
          message_id: message_id,
          room_id: roomId,
        })
      );
    }
  };

  const handleBack = () => {
    if (socket) {
      socket.onmessage = null;
      socket.close();
    }
    setSocket(null);
    setIsOnline(false);
    router.back();
  };


  return (
  <div className="flex h-dvh flex-col overflow-hidden rounded-2xl border border-violet-500/30 bg-[#0b0d24]">
   
    {otherParticipant && (

      <header className="flex items-center gap-3 border-b border-violet-500/30 bg-[#17152f] px-4 py-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-cyan-200 transition hover:bg-violet-500/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Link
          href={`/main/profile/${otherParticipant?.id}`}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
        {otherParticipant.profile_pic ? (
          <img
            src={
              otherParticipant.profile_pic.startsWith("http")
                ? otherParticipant.profile_pic
                : `https://animehub-3-kbnb.onrender.com${otherParticipant.profile_pic.startsWith("/") ? "" : "/"}${otherParticipant.profile_pic}`
            }
            alt={`${otherParticipant.username} avatar`}
            className="size-10 shrink-0 rounded-full bg-violet-500/30 object-cover ring-2 ring-pink-400/70"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/40 font-bold uppercase text-white"
          >
            {otherParticipant.username?.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-cyan-100">{otherParticipant.username}</p>
          {otherParticipant.bio && (
            <p className="truncate text-xs text-indigo-300">{otherParticipant.bio}</p>
          )}
          {isOnline && (
            <p className="truncate text-xs text-green-400">Online</p>
          )}
        </div>
        </Link>
        {!blocked ? (
          <button
            onClick={() => handleBlockUser(otherParticipant.id)}
            className="ml-auto shrink-0 rounded-full border border-red-400/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 active:scale-95"
          >
            Block User
          </button>
        ) : (
          <button
            onClick={() => handleUnblockUser(otherParticipant.id)}
            className="ml-auto shrink-0 rounded-full border border-green-400/40 bg-green-500/10 px-3.5 py-1.5 text-xs font-semibold text-green-300 transition hover:border-green-400 hover:bg-green-500 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/70 active:scale-95"
          >
            Unblock User
          </button>
        )}
      </header>
       
    )}
     
    {/* Messages */}
    <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-4">
      {messages.map((msg, index) => {
        const isMine =
          currentUserId !== null && String(msg.author?.id) === currentUserId;

        return (
          <div key={msg.id ?? index}>
            <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                onContextMenu={(e) => {
                  if (!isMine || msg.id === undefined) return;
                  e.preventDefault();
                  setMenuMessageId(String(msg.id));
                }}
                onTouchStart={() => {
                  if (isMine && msg.id !== undefined) startLongPress(String(msg.id));
                }}
                onTouchEnd={cancelLongPress}
                onTouchMove={cancelLongPress}
                onTouchCancel={cancelLongPress}
                className={`relative max-w-[80%] select-none rounded-2xl px-3 py-2 transition duration-150 sm:max-w-[65%] ${
                  isMine && menuMessageId === String(msg.id)
                    ? "z-10 scale-[1.02] shadow-lg shadow-black/50 ring-2 ring-white/80 ring-offset-2 ring-offset-[#0b0d24] brightness-90"
                    : ""
                } ${
                  isMine
                    ? msg.is_seen
                      ? "rounded-br-sm bg-green-400 text-slate-950"
                      : "rounded-br-sm bg-cyan-300 text-slate-950"
                    : "rounded-bl-sm bg-[#1a1650] text-indigo-100"
                }`}
              >
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-5">
                  {msg.content}
                </p>
                {isMine && menuMessageId === String(msg.id) && (
                  <div
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-violet-500/40 bg-[#17152f] text-sm shadow-xl shadow-black/50"
                  >
                    <button
                      role="menuitem"
                      onClick={() => handleDeleteMessage(String(msg.id))}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold text-red-400 transition hover:bg-red-500/15 active:bg-red-500/25"
                    >
                      Delete message
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => setMenuMessageId(null)}
                      className="flex w-full items-center gap-2 border-t border-violet-500/20 px-4 py-3 text-left text-indigo-200 transition hover:bg-violet-500/15 active:bg-violet-500/25"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <p
                  className={`mt-1 text-right text-[10px] ${
                    isMine ? "text-slate-700" : "text-indigo-300/70"
                  }`}
                >
                  {msg.created_at &&
                    new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {isMine && msg.is_seen && (
                    <span className="ml-1 font-semibold text-green-900">Seen</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />

       <div
  role="status"
  aria-live="polite"
  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
    isTyping ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`}
>
  <div className="overflow-hidden">
    <div
      id="typing-indicator"
      className="flex items-center gap-1.5 px-3 py-1 sm:px-4"
    >
      {/* dots bubble */}
      <span className="flex items-center gap-[3px] rounded-2xl rounded-bl-sm bg-indigo-500/20 px-2.5 py-1.5">
        {["-0.3s", "-0.15s", "0s"].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: delay }}
            className={`h-1 w-1 rounded-full bg-indigo-300 sm:h-1.5 sm:w-1.5 ${
              isTyping ? "animate-bounce" : ""
            }`}
          />
        ))}
      </span>

      {/* text: hidden on mobile, shown on larger screens */}
      <span className="hidden max-w-[10vw] truncate text-[11px] text-indigo-300 sm:inline">
        {otherParticipant?.username} is typing…
      </span>

      {/* screen-reader text for mobile */}
      {isTyping && (
        <span className="sr-only">{otherParticipant?.username} is typing</span>
      )}
    </div>
  </div>
</div>
      
    </div>

    {sendError && (
      <p
        role="alert"
        className="border-t border-red-500/40 bg-red-500/10 px-4 py-2 text-center text-xs text-red-300"
      >
        {sendError}
      </p>
    )}

    {/* Input */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) handleSend();
      }}
      className="flex items-center gap-2 border-t border-violet-500/30 bg-[#17152f] p-2 sm:p-3"
    >
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
        aria-label="Message"
        className="min-w-0 flex-1 rounded-full border border-violet-500/35 bg-[#0b0d24] px-4 py-2.5 text-base text-white outline-none placeholder:text-indigo-400 focus:border-cyan-300/70 sm:text-sm"
      />
       <div className="mt-3 flex justify-between items-center">
                      <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                      >
                          {showEmojiPicker ? "Close" : "Add Emoji"}
                      </button>
                    
                  </div>
              
      <button
        type="submit"
        disabled={!input.trim()}
        className="h-11 shrink-0 rounded-full bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
         
    </form>
    {showEmojiPicker && (
          <div className="mt-2 w-full overflow-hidden rounded-lg border border-violet-500/30">
              <EmojiPicker
                  theme={Theme.DARK}
                  onEmojiClick={(emojiData: EmojiClickData) =>
                      setInput((prev) => prev + emojiData.emoji)
                  }
                  width="100%"
                  height={isDesktop ? 280 : 320}
                  lazyLoadEmojis
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                  searchPlaceHolder="Search emoji"
                  style={
                      {
                          "--epr-bg-color": "#17152f",
                          "--epr-category-label-bg-color": "#17152f",
                          "--epr-search-input-bg-color": "#0b0d24",
                          "--epr-highlight-color": "#67e8f9",
                          "--epr-picker-border-color": "transparent",
                      } as React.CSSProperties
                  }
              />
          </div>
        )}
  </div>
);
};
export default ChatComponent;
