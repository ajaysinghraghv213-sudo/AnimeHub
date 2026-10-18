'use client';


import { useEffect, useState } from 'react';
import { Check, MessageCircle, UserPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchOtherProfileView } from '@/app/redux/features/otherprofileview';
import { fetchOtherFollowers, addFollower, removeOtherFollower } from '@/app/redux/features/otherfollowers';
import { addFollowers } from '@/app/function/getfollowers';
import { toast } from 'sonner';
import { unfollowUser } from '@/app/function/unfollow';
import { getchats } from '@/app/function/chatinitials';
import { createChat } from '@/app/function/createchat';


const OtherProfileView = ({ userId }: { userId: string }) => {
    const dispatch = useDispatch() as unknown as (action: unknown) => unknown;
    const router = useRouter();
    const { profile, loading, error } = useSelector((state: any) => state.otherProfileView);
    const { followers, following, loading: connectionsLoading } = useSelector(
        (state: any) => state.otherFollowers
    );
    const [followError, setFollowError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [followSubmitting, setFollowSubmitting] = useState(false);
    const isFollowing = currentUserId !== null && followers.some(
        (follower: any) => String(follower?.id) === currentUserId
    );

     //this is to see followers and following of someonelse//
    const handleProfileView = (userId?: number | string) => {
        if (userId === undefined) return;
        dispatch(fetchOtherProfileView(String(userId)));
        // Assuming you have a router to navigate to the profile page
        router.push(`/main/profile/${userId}`);
    };

    const handleOpenChat = async () => {
        const findRoom = (list: any) =>
            Array.isArray(list)
                ? list.find((c: any) =>
                      c.participants?.some((p: any) => String(p.id) === userId),
                  )
                : null;

        try {
            let room = findRoom(await getchats());
            if (!room) {
                const created = await createChat(userId);
                console.log('createChat response:', created);
                room = created?.room_id ? created : created?.chat ?? findRoom(await getchats());
            }
            if (!room?.room_id) throw new Error('Missing room_id');
            router.push(`/chat/${room.room_id}`);
        } catch {
            toast.error('Could not open chat');
        }
    };

    const handleAddFollower = async () => {
        if (!currentUserId || isFollowing || followSubmitting) return;

        try {
            setFollowError(null);
            setFollowSubmitting(true);
            await addFollowers(userId);
            dispatch(addFollower({ id: currentUserId }));
            toast.success(`You are now following ${profile?.username || 'this user'}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to follow user';
            setFollowError(message);
            toast.error(message);
        } finally {
            setFollowSubmitting(false);
        }
    };
    
    const handleUnfollow = async () => {
        if (!currentUserId || !isFollowing || followSubmitting) return;

        try {
            setFollowError(null);
            setFollowSubmitting(true);
            await unfollowUser(userId);
            dispatch(removeOtherFollower(currentUserId));
            toast.success(`You have unfollowed ${profile?.username || 'this user'}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to unfollow user';
            setFollowError(message);
            toast.error(message);
        } finally {
            setFollowSubmitting(false);
        }
    };




    useEffect(() => {
        setCurrentUserId(localStorage.getItem('user_id'));
        if (userId) {
            dispatch(fetchOtherProfileView(userId));
            dispatch(fetchOtherFollowers(userId));
        }
    }, [userId, dispatch]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="flex flex-col items-center">

                {/* Spinner */}
                <div className="relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute h-14 w-14 rounded-full border-4 border-gray-200"></div>

                    <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-black"></div>

                    <div className="h-3 w-3 rounded-full bg-black animate-pulse"></div>
                </div>

                {/* Loading text */}
                <div className="mt-5 flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">
                        Loading
                    </span>

                    <span className="flex gap-1">
                        <span className="h-1 w-1 rounded-full bg-gray-700 animate-bounce [animation-delay:0ms]"></span>
                        <span className="h-1 w-1 rounded-full bg-gray-700 animate-bounce [animation-delay:150ms]"></span>
                        <span className="h-1 w-1 rounded-full bg-gray-700 animate-bounce [animation-delay:300ms]"></span>
                    </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                    Please wait a moment
                </p>
            </div>
        </div>;
    }
    if (error) {
        return <p>Error loading profile.</p>;
    }

    if (!profile) {
        return <p>Profile not found.</p>;
    }
    return (
        <main className="min-h-screen bg-[#0b0d24] px-4 py-6 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <section className="overflow-hidden rounded-3xl border-2 border-violet-500/60 bg-[#12143a] shadow-[8px_8px_0_rgba(139,92,246,0.45)]">
                    <div className="relative h-32 border-b-4 border-pink-500 bg-[linear-gradient(120deg,#1b1450,#4a1d78_55%,#be185d)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:[background-image:repeating-conic-gradient(from_0deg_at_80%_50%,rgba(255,255,255,0.08)_0deg_1.5deg,transparent_1.5deg_9deg)] sm:h-44" />
                    <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
                                <img
                                    src={`https://animehub-2-i11e.onrender.com${profile?.profile_pic || '/file.svg'}`}
                                    alt="User avatar"
                                    className="h-28 w-28 rounded-3xl border-4 border-white bg-slate-900 object-cover shadow-[5px_5px_0_#ec4899] sm:h-32 sm:w-32"
                                />
                                <div className="mb-1">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/60 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                                        Active member
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleOpenChat}
                                    disabled={!currentUserId || currentUserId === userId}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-cyan-300/70 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                                    Chat
                                </button>
                                <button
                                    onClick={isFollowing ? handleUnfollow : handleAddFollower}
                                    type="button"
                                    disabled={followSubmitting || !currentUserId}
                                    aria-pressed={isFollowing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_#22d3ee]"
                                >
                                    {isFollowing ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    {followSubmitting ? (isFollowing ? 'Unfollowing...' : 'Following...') : isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        </div>

                        {followError && (
                            <p className="mt-3 border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-sm font-semibold text-pink-200">{followError}</p>
                        )}

                        <div className="mt-5 max-w-2xl">
                            <h1 className="text-3xl font-black italic tracking-tight text-white drop-shadow-[3px_3px_0_#ec4899] sm:text-4xl">
                                {profile?.username || 'Username'}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-indigo-200 sm:text-base">
                                {profile?.bio || 'User bio will appear here.'}
                            </p>
                        </div>

                        <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border-2 border-violet-500/40 bg-[#0b0d24]/60 p-4">
                                <p className="text-2xl font-black text-cyan-300">{followers.length}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-indigo-300">Followers</p>
                            </div>
                            <div className="rounded-2xl border-2 border-violet-500/40 bg-[#0b0d24]/60 p-4">
                                <p className="text-2xl font-black text-pink-300">{following.length}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-indigo-300">Following</p>
                            </div>
                            <div className="col-span-2 rounded-2xl border-2 border-violet-500/40 bg-[#0b0d24]/60 p-4 sm:col-span-1">
                                <p className="text-2xl font-black text-yellow-300">Public</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-indigo-300">Profile status</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border-2 border-violet-500/50 bg-[#12143a]/90 p-5 shadow-[6px_6px_0_rgba(139,92,246,0.4)] sm:p-6">
                        <h2 className="border-l-4 border-cyan-300 pl-3 text-lg font-black text-white">Followers</h2>
                        <p className="mt-1 text-sm text-indigo-300">People who follow this user</p>

                        <div className="mt-5 max-h-64 space-y-3 overflow-y-auto overscroll-contain sm:max-h-80">
                            {connectionsLoading ? (
                                <p className="text-sm text-indigo-300">Loading followers...</p>
                            ) : followers.length > 0 ? (
                                followers.map((follower: any, index: number) => (
                                    <div
                                        key={follower.id ?? index}
                                        className="flex items-center gap-3 rounded-xl border-2 border-violet-500/30 bg-[#0b0d24]/60 p-3 transition hover:border-pink-400/60"
                                    >
                                        <img
                                            onClick={() => handleProfileView(follower.id)}
                                            style={{ cursor: 'pointer' }}
                                            src={follower.profile_pic
                                                ? `https://animehub-2-i11e.onrender.com${follower.profile_pic}`
                                                : '/file.svg'}
                                            alt={`${follower.username || 'Member'} avatar`}
                                            className="h-10 w-10 rounded-full bg-slate-900 object-cover ring-2 ring-pink-400 ring-offset-2 ring-offset-[#12143a] transition hover:ring-cyan-300"
                                        />
                                        <p className="text-sm font-bold text-cyan-200">
                                            {follower.username || 'Member'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-indigo-300">No followers yet.</p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border-2 border-violet-500/50 bg-[#12143a]/90 p-5 shadow-[6px_6px_0_rgba(139,92,246,0.4)] sm:p-6">
                        <h2 className="border-l-4 border-pink-500 pl-3 text-lg font-black text-white">Following</h2>
                        <p className="mt-1 text-sm text-indigo-300">People and creators this user follows</p>

                        <div className="mt-5 max-h-64 space-y-3 overflow-y-auto overscroll-contain sm:max-h-80">
                            {connectionsLoading ? (
                                <p className="text-sm text-indigo-300">Loading following...</p>
                            ) : following.length > 0 ? (
                                following.map((followedUser: any, index: number) => (
                                    <div
                                        key={followedUser.id ?? index}
                                        className="flex items-center gap-3 rounded-xl border-2 border-violet-500/30 bg-[#0b0d24]/60 p-3 transition hover:border-pink-400/60"
                                    >
                                        <img
                                            onClick={() => handleProfileView(followedUser.id)}
                                            style={{ cursor: 'pointer' }}
                                            src={followedUser.profile_pic
                                                ? `https://animehub-2-i11e.onrender.com${followedUser.profile_pic}`
                                                : '/file.svg'}
                                            alt={`${followedUser.username || 'Member'} avatar`}
                                            className="h-10 w-10 rounded-full bg-slate-900 object-cover ring-2 ring-pink-400 ring-offset-2 ring-offset-[#12143a] transition hover:ring-cyan-300"
                                        />
                                        <p className="text-sm font-bold text-cyan-200">
                                            {followedUser.username || 'Member'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-indigo-300">Not following anyone yet.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default OtherProfileView;
