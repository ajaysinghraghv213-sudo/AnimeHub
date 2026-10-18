'use client'

import {useState} from "react"
import { useRouter } from "next/navigation"
import { VerifyOTP } from "../function/register"
import { toast } from 'sonner'


const Page = () =>{

    const router = useRouter()
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")

    const handleVerifyOTP = async() =>{
        try {
             const email = localStorage.getItem("email") || "" 
            const data = await VerifyOTP({email, otp})
            console.log(data)

            if (data) {
                toast.success('Email verified successfully');
                router.push("/login")
            } else {
                toast.error('OTP verification failed. Check the code and try again.');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'OTP verification failed';
            setError(message)
            toast.error(message)
        }
    }


    return(
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d24] px-4 py-8 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] [background-size:22px_22px]">
    <div className="w-full max-w-md rounded-2xl border-2 border-violet-500/60 bg-[#12143a]/95 p-8 shadow-[8px_8px_0_rgba(139,92,246,0.45)]">
        
        <h1 className="text-2xl font-black italic text-center text-white drop-shadow-[3px_3px_0_#ec4899]">
            Verify OTP
        </h1>

        <p className="mt-2 text-center text-sm text-indigo-300">
            Enter the OTP sent to your email address
        </p>

        <div className="mt-6">
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border-2 border-violet-500/40 bg-[#0b0d24] px-4 py-3 text-center font-bold tracking-[0.5em] text-cyan-200 outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-indigo-400/60 focus:border-pink-400 focus:shadow-[3px_3px_0_#ec4899]"
            />
        </div>

        <button
            className="mt-5 w-full rounded-xl border-2 border-white bg-[linear-gradient(90deg,#ec4899,#8b5cf6)] py-3 font-black text-white shadow-[4px_4px_0_#22d3ee] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#22d3ee] active:translate-y-0 active:shadow-[2px_2px_0_#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            onClick={handleVerifyOTP}
        >
            Verify OTP
        </button>

        {error && (
            <p className="mt-5 border-l-4 border-pink-500 bg-pink-500/10 px-3 py-2 text-center text-sm font-semibold text-pink-200">
                {error}
            </p>
        )}

        <p className="mt-5 text-center text-sm text-indigo-300">
            Didn't receive the OTP?{" "}
            <button className="font-bold text-cyan-300 transition hover:text-pink-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                Resend OTP
            </button>
        </p>
    </div>
</div>
    )
 }      
export default Page