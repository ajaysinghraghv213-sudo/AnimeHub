'use client'

import { profileView, updateProfile } from "../function/profileview";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";
import { toast } from 'sonner';
import { useUser } from '@/context/userContext';

const EditProfile = () => {


    const router = useRouter();
    const { setUser } = useUser();
    const searchParams = useSearchParams();
    const username = searchParams.get("username") || "";
    const bio = searchParams.get("bio") || "";
     const [profileData, setProfileData] = useState({
         username: username,
         bio: bio,
         profile_pic: null as File | null
     });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         const target = e.target;
         const { name, value } = target;
         const selectedFile = target instanceof HTMLInputElement ? target.files?.[0] : undefined;
         if (name === "profile_pic" && selectedFile) {
             setProfileData(prev => ({ ...prev, profile_pic: selectedFile }));
         } else {
             setProfileData(prev => ({ ...prev, [name]: value }));
         }
     };

     const handleSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         try {
             await updateProfile(profileData);
             const updatedProfile = await profileView();
             console.log(updatedProfile);
             setUser(updatedProfile);
             console.log("Profile updated successfully:", updatedProfile);
             toast.success('Profile updated successfully');
             router.push('/main/profile');
         } catch (error) {
             console.error("Error updating profile:", error);
             toast.error(error instanceof Error ? error.message : 'Failed to update profile');
         }
     };
     useEffect(() => {
         setProfileData({
             username: username,
             bio: bio,
             profile_pic: null
         });
     }, [username,bio]);


    return (
       
<div className="min-h-screen bg-[#0b0d24] px-4 py-10 text-white [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
    <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 border-l-4 border-pink-500 pl-4">
            <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.3em] text-cyan-300">
                Profile Settings
            </p>

            <h1 className="text-4xl font-black italic tracking-tight drop-shadow-[3px_3px_0_#ec4899] sm:text-5xl">
                Edit <span className="text-pink-300">Profile</span>
            </h1>

            <p className="mt-3 text-sm text-indigo-300">
                Customize your identity and let your profile tell your story.
            </p>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-violet-500/60 bg-[#12143a]/95 shadow-[8px_8px_0_rgba(139,92,246,0.45)]">

            {/* Anime glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-pink-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

            <form onSubmit={handleSubmit} className="relative space-y-7 p-6 sm:p-10">

                {/* Username */}
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-bold text-cyan-200"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        value={profileData.username}
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="w-full rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] px-4 py-3 text-white outline-none transition placeholder:text-indigo-400/60 focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899]"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label
                        htmlFor="bio"
                        className="mb-2 block text-sm font-bold text-cyan-200"
                    >
                        Bio
                    </label>

                    <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell people something about yourself..."
                        rows={4}
                        className="w-full resize-none rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] px-4 py-3 text-white outline-none transition placeholder:text-indigo-400/60 focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899]"
                    />
                </div>

                {/* Profile Picture */}
                <div>
                    <label
                        htmlFor="profile_pic"
                        className="mb-2 block text-sm font-bold text-cyan-200"
                    >
                        Profile Picture
                    </label>

                    <label
                        htmlFor="profile_pic"
                        className="group flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-violet-400/50 bg-violet-500/10 px-5 py-8 transition hover:border-pink-400 hover:bg-pink-500/10 focus-within:border-cyan-300"
                    >
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-2xl text-yellow-200 shadow-[3px_3px_0_#22d3ee] transition group-hover:scale-110">
                                ✦
                            </div>

                            <p className="text-sm font-bold text-white">
                                Choose a new profile picture
                            </p>

                            <p className="mt-1 text-xs text-indigo-300">
                                PNG, JPG or WEBP
                            </p>
                        </div>

                        <input
                            id="profile_pic"
                            type="file"
                            name="profile_pic"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Divider */}
                <div className="h-0.5 bg-[repeating-linear-gradient(90deg,rgba(167,139,250,0.5)_0_8px,transparent_8px_14px)]" />

                {/* Button */}
                <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] px-6 py-3.5 font-black text-white shadow-[4px_4px_0_#22d3ee] transition duration-300 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] active:translate-y-0 active:shadow-[2px_2px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>✦</span>
                        Update Profile
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </span>
                </button>

            </form>
        </div>
    </div>
</div>
    )
    
}

export default EditProfile;