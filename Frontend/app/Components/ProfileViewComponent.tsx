'use client';

import { profileView } from '@/app/function/profileview';
import { fetchFollowers } from '@/app/redux/features/followers';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Pencil, RefreshCw } from 'lucide-react';
import { fetchOtherProfileView } from '../redux/features/otherprofileview';
import { useUser } from '@/context/userContext';

type Profile = {
    profile_pic: string | null;
    username: string;
    bio: string | null;
};

type Connection = {
    id?: number | string;
    username?: string;
    profile_pic?: string | null;
};

type FollowersState = {
    followers: Connection[];
    following: Connection[];
    loading: boolean;
    error: string | null;
};

type AppState = {
    followers: FollowersState;
};

type AppDispatch = (action: unknown) => unknown;

const ProfileViewComponent = () => {
    const router = useRouter();
    const { user, setUser } = useUser();
    const dispatch = useDispatch() as unknown as AppDispatch;
    const { followers, following, loading: connectionsLoading, error: connectionsError } = useSelector(
        (state: AppState) => state.followers
    );
    const [profile, setProfile] = useState<Profile | null>(user);
    const [loading, setLoading] = useState(user === null);
    const [error, setError] = useState<Error | null>(null);



     const handleProfileView = (userId?: number | string) => {
            if (userId === undefined) return;
            dispatch(fetchOtherProfileView(String(userId)));
            router.push(`/main/profile/${userId}`);
        };
    

    useEffect(() => {
        dispatch(fetchFollowers());

        if (user) {
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await profileView();
                setProfile(data);
                setUser(data);
                console.log(data)
            } catch (err) {
                const profileError = err instanceof Error
                    ? err
                    : new Error('Failed to fetch profile');
                setError(profileError);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [dispatch, router, setUser, user]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
                    <p className="mt-4 text-sm font-medium text-slate-600">Loading your profile</p>
                </div>
            </div>
        );
    }

    if (error !== null) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm font-medium text-red-600">{error.message}</p>
                </div>
            </div>
        );
    }

    const displayedProfile = user ?? profile;
    if (displayedProfile === null) return null;

    return (
        <main className="min-h-screen bg-[#0b0d24] px-4 py-6 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <section className="overflow-hidden rounded-3xl border-2 border-violet-500/60 bg-[#12143a] shadow-[8px_8px_0_rgba(139,92,246,0.45)]">
                    <div className="relative h-32 border-b-4 border-pink-500 bg-[linear-gradient(120deg,#1b1450,#4a1d78_55%,#be185d)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:[background-image:repeating-conic-gradient(from_0deg_at_80%_50%,rgba(255,255,255,0.08)_0deg_1.5deg,transparent_1.5deg_9deg)] sm:h-44" />
                    <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
                                <img
                                    src={displayedProfile.profile_pic
                                        ? `https://animehub-2-i11e.onrender.com${displayedProfile.profile_pic}`
                                        : '/file.svg'}
                                    alt={`${displayedProfile.username}'s avatar`}
                                    className="h-28 w-28 rounded-3xl border-4 border-white bg-slate-900 object-cover shadow-[5px_5px_0_#ec4899] sm:h-32 sm:w-32"
                                />
                                <div className="mb-1">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/60 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                                        Active member
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.push(`/main/updateprofile?username=${encodeURIComponent(displayedProfile.username)}&bio=${encodeURIComponent(displayedProfile.bio ?? '')}&profile_pic=${encodeURIComponent(displayedProfile.profile_pic || '')}`)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit profile
                            </button>
                        </div>

                        <div className="mt-5 max-w-2xl">
                            <h1 className="text-3xl font-black italic tracking-tight text-white drop-shadow-[3px_3px_0_#ec4899] sm:text-4xl">
                                {displayedProfile.username}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-indigo-200 sm:text-base">
                                {displayedProfile.bio || 'Share a little about yourself with the community.'}
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

                {connectionsError && (
                    <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-sm font-semibold text-pink-200">
                        <span>{connectionsError}</span>
                        <button
                            type="button"
                            onClick={() => dispatch(fetchFollowers())}
                            className="inline-flex shrink-0 items-center gap-1.5 font-bold text-cyan-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border-2 border-violet-500/50 bg-[#12143a]/90 p-5 shadow-[6px_6px_0_rgba(139,92,246,0.4)] sm:p-6">
                        <h2 className="border-l-4 border-cyan-300 pl-3 text-lg font-black text-white">Followers</h2>
                        <p className="mt-1 text-sm text-indigo-300">People who follow your updates</p>

                        <div className="mt-5 max-h-64 space-y-3 overflow-y-auto overscroll-contain sm:max-h-80">
                            {connectionsLoading ? (
                                <p className="text-sm text-indigo-300">Loading followers...</p>
                            ) : followers.length > 0 ? (
                                followers.map((follower, index) => (
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
                        <p className="mt-1 text-sm text-indigo-300">People and creators you follow</p>

                        <div className="mt-5 max-h-64 space-y-3 overflow-y-auto overscroll-contain sm:max-h-80">
                            {connectionsLoading ? (
                                <p className="text-sm text-indigo-300">Loading following...</p>
                            ) : following.length > 0 ? (
                                following.map((followedUser, index) => (
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

export default ProfileViewComponent;
