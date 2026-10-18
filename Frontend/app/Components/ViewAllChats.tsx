'use client';

import { getchats } from '@/app/function/chatinitials';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { deletechatforcurrentuser } from '@/app/function/chatinitials';


type Participant = {
    id: number;
    username: string;
    bio?: string;
    profile_pic?: string;
};

type ChatRoom = {
    id: number;
    room_id: string;
    participants: Participant[] | null;
    created_at: string;
};

const API = 'https://animehub-2-i11e.onrender.com';

export default function ViewAllChats() {
    const [chats, setChats] = useState<ChatRoom[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [menumessageid,setMenuMessageId] = useState<string | null>(null);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressed = useRef(false);

    const startLongPress = (roomId: string) => {
        longPressed.current = false;
        longPressTimer.current = setTimeout(() => {
            longPressed.current = true;
            setMenuMessageId(roomId);
        }, 500);
    };
    const cancelLongPress = () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };

    const handleDeleteChat = async (roomId: string) => {
        setMenuMessageId(null);
        const result = await deletechatforcurrentuser(roomId);
        if (result) {
            setChats((prev) =>
                prev.map((c) => (c.room_id === roomId ? { ...c, participants: null } : c)),
            );
        } else {
            console.error(`Failed to delete chat ${roomId}`);
        }
    };

    // Dismiss the menu on outside tap or Escape
    useEffect(() => {
        if (menumessageid === null) return;
        const close = () => setMenuMessageId(null);
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
        document.addEventListener('click', close);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', close);
            document.removeEventListener('keydown', onKey);
        };
    }, [menumessageid]);

    useEffect(() => {
        const fetchChats = async () => {
            setCurrentUserId(localStorage.getItem('user_id'));
            const data = await getchats();
            if (Array.isArray(data)) {
                setChats(data);
            }
            setLoading(false);
        };
        fetchChats();
    }, []);
    // useEffect(() => {
    //     const data = getchats();
    //     if (Array.isArray(data)) {
    //         setChats(data);
    //     }
    // }, []);

    return (
        <section className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
            <div className="flex items-center gap-2.5">
                <MessageCircle aria-hidden="true" className="size-5 text-cyan-300" />
                <h1 className="text-xl font-bold text-white">All Chats</h1>
            </div>

            {loading ? (
                <p className="mt-5 text-sm text-indigo-300">Loading chats...</p>
            ) : chats.length === 0 ? (
                <p className="mt-5 rounded-xl border border-dashed border-violet-500/35 px-4 py-6 text-center text-sm text-indigo-300">
                    No chats yet.
                </p>
            ) : (
                <ul className="mt-5 space-y-3">
                    {chats.map((chat) => {
                        if (!chat.participants) return null;
                        const other =
                            chat.participants.find((p) => String(p.id) !== currentUserId) ??
                            chat.participants[0];
                        if (!other) return null;

                        const isSelected = menumessageid === chat.room_id;

                        return (
                                <li
                                 onContextMenu={(e) => {
                                     e.preventDefault();
                                     setMenuMessageId(chat.room_id);
                                 }}
                                 onTouchStart={() => startLongPress(chat.room_id)}
                                 onTouchEnd={cancelLongPress}
                                 onTouchMove={cancelLongPress}
                                 onTouchCancel={cancelLongPress}
                                 key={chat.id}
                                 className={`relative select-none rounded-xl transition duration-150 ${
                                     isSelected
                                         ? 'z-10 scale-[1.01] ring-2 ring-white/80 ring-offset-2 ring-offset-[#0b0d24]'
                                         : ''
                                 }`}>
                                <Link
                                    href={`/chat/${chat.room_id}`}
                                    onClick={(e) => {
                                        // A long press must not navigate
                                        if (longPressed.current) {
                                            e.preventDefault();
                                            longPressed.current = false;
                                        }
                                    }}
                                    onDragStart={(e) => e.preventDefault()}
                                    className="flex min-w-0 items-center gap-4 rounded-xl border border-violet-500/25 bg-[#0b0d24]/60 p-4 transition-colors hover:border-violet-400/60 hover:bg-[#12143a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                >
                                    {other.profile_pic ? (
                                        <img
                                            src={`${API}${other.profile_pic}`}
                                            alt={`${other.username} avatar`}
                                            className="size-12 shrink-0 rounded-full bg-violet-500/30 object-cover ring-2 ring-pink-400/70"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-violet-500/40 font-bold uppercase text-white"
                                        >
                                            {other.username.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <p className="truncate font-semibold text-cyan-100">
                                                {other.username}
                                            </p>
                                            <time
                                                dateTime={chat.created_at}
                                                className="shrink-0 text-xs text-indigo-300"
                                            >
                                                {new Date(chat.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                        {other.bio && (
                                            <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-indigo-200/80">
                                                {other.bio}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                                {isSelected && (
                                    <div
                                        role="menu"
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-3 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-violet-500/40 bg-[#17152f] text-sm shadow-xl shadow-black/50"
                                    >
                                        <button
                                            role="menuitem"
                                            onClick={() => handleDeleteChat(chat.room_id)}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold text-red-400 transition hover:bg-red-500/15 active:bg-red-500/25"
                                        >
                                            Delete chat
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
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}