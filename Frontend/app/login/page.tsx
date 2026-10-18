'use client'

import { useState } from "react"
import { LoginUser } from "../function/login"
import React from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import { toast } from 'sonner'
const Page = () => { 
    const router = useRouter()
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);


    const handleLogin = async () => {
        try {
            const res = await LoginUser({ username_or_email: usernameOrEmail, password, setError });
            if (res.ok) {
                toast.success("Login successful");
                router.push('/');
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Login failed');
        }
        
    };


    return (
        
<div className="min-h-screen bg-[#0b0d24] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
    <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-violet-500/60 bg-[#12143a]/95 p-6 shadow-[8px_8px_0_rgba(139,92,246,0.45)] sm:p-8">
            
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-lg font-black text-white shadow-[3px_3px_0_#22d3ee]">
                    L
                </div>

                <h1 className="text-2xl font-black italic tracking-tight text-white drop-shadow-[3px_3px_0_#ec4899] sm:text-3xl">
                    Welcome Back
                </h1>

                <p className="mt-2 text-sm text-indigo-300 sm:text-base">
                    Enter your credentials to login
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
                {/* Username / Email */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-cyan-200">
                        Username or Email
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username or email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] px-4 py-3 text-sm text-white outline-none transition placeholder:text-indigo-400/60 focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899] sm:text-base"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="mb-2 block text-sm font-bold text-cyan-200">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] px-4 py-3 text-sm text-white outline-none transition placeholder:text-indigo-400/60 focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899] sm:text-base"
                    />
                </div>

                {/* Login Button */}
                <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#22d3ee] transition duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] active:translate-y-0 active:shadow-[2px_2px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:text-base"
                >
                    Login
                </button>
            </div>
           
{error && (
    <div className="mt-5 flex items-center gap-3 rounded-xl border-l-4 border-pink-500 bg-pink-500/10 px-4 py-3 text-pink-200 animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Error Icon */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500/25">
            <span className="text-sm font-black text-yellow-300">!</span>
        </div>

        {/* Error Message */}
        <p className="text-sm font-semibold leading-5">
            {error}
        </p>
    </div>
)}



            {/* Footer */}
            <p className="mt-6 text-center text-sm text-indigo-300">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="font-bold text-cyan-300 transition hover:text-pink-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    Create account
                </Link>
            </p>
        </div>
    </div>
</div>

    )
}

export default Page;