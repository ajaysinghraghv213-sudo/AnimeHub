'use client'

import {useState} from "react"
import { RegisterUser } from "../function/register"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from 'sonner'
const Page = () =>{

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirm_password, setConfirmPassword] = useState("")
     const [error, setError] = useState<{[key: string]: string}>({});

    const router = useRouter()

    const handleRegister = async() =>{
        try {
            const result = await RegisterUser({username,email,password, confirm_password,setError})
        console.log(result)
        if(result){
            localStorage.setItem("email", email)
            toast.success('Account created. Verify your email to continue.');
            router.push("/verifyotp")
        } else {
            const firstError = Object.values(error)[0];
            toast.error(firstError || 'Registration failed. Please check your details.');
        }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Registration failed');
        }
    }

    return (
    
<div className="min-h-screen bg-[#0b0d24] flex items-center justify-center px-4 py-8 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">

    <div className="w-full max-w-md">

        {/* Register Card */}
        <div className="bg-[#12143a]/95 border-2 border-violet-500/60 rounded-2xl shadow-[8px_8px_0_rgba(139,92,246,0.45)] p-8">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black italic text-white drop-shadow-[3px_3px_0_#ec4899]">
                    Create an account
                </h1>

                <p className="mt-2 text-sm text-indigo-300">
                    Join us and start sharing your articles
                </p>
            </div>


            {/* Form */}
            <div className="space-y-5">

                {/* Username */}
                <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-2">
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border-2
                            border-violet-500/40
                            bg-[#0b0d24]
                            text-white
                            placeholder:text-indigo-400/60
                            outline-none
                            transition
                            focus:border-pink-400
                            focus:shadow-[3px_3px_0_#ec4899]
                        "
                    />
                </div>
                {error?.username && <p className="border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-200 text-sm font-semibold mt-1">{error.username}</p>}


                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-2">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border-2
                            border-violet-500/40
                            bg-[#0b0d24]
                            text-white
                            placeholder:text-indigo-400/60
                            outline-none
                            transition
                            focus:border-pink-400
                            focus:shadow-[3px_3px_0_#ec4899]
                        "
                    />
                </div>
                {error?.email && <p className="border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-200 text-sm font-semibold mt-1">{error.email}</p>}


                {/* Password */}
                <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-2">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border-2
                            border-violet-500/40
                            bg-[#0b0d24]
                            text-white
                            placeholder:text-indigo-400/60
                            outline-none
                            transition
                            focus:border-pink-400
                            focus:shadow-[3px_3px_0_#ec4899]
                        "
                    />
                </div>
                {error?.password && <p className="border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-200 text-sm font-semibold mt-1">{error.password}</p>}  


                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-bold text-cyan-200 mb-2">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirm_password}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            border-2
                            border-violet-500/40
                            bg-[#0b0d24]
                            text-white
                            placeholder:text-indigo-400/60
                            outline-none
                            transition
                            focus:border-pink-400
                            focus:shadow-[3px_3px_0_#ec4899]
                        "
                    />
                </div>
                {error?.confirm_password && <p className="border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-pink-200 text-sm font-semibold mt-1">{error.confirm_password}</p>}


                {/* Register Button */}
                <button
                    onClick={handleRegister}
                    className="
                        w-full
                        mt-2
                        py-3
                        rounded-xl
                        border-2
                        border-white
                        bg-[linear-gradient(90deg,#ec4899,#8b5cf6)]
                        text-white
                        font-black
                        shadow-[4px_4px_0_#22d3ee]
                        transition
                        duration-200
                        hover:-translate-y-0.5
                        hover:shadow-[6px_6px_0_#22d3ee]
                        active:translate-y-0
                        active:shadow-[2px_2px_0_#22d3ee]
                        focus:outline-none
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-cyan-300
                    "
                >
                    Register
                </button>

            </div>
          

            {/* Login Link */}
            <p className="text-center text-sm text-indigo-300 mt-6">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-bold text-cyan-300 transition hover:text-pink-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    Login
                </Link>
            </p>

        </div>

    </div>

</div>

    )
}
export default Page;