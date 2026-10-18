import ViewAllChats from '@/app/Components/ViewAllChats';
import Navbar from '../Components/Navbar';



export default function ChatPage() {
    return (
      <>
        <Navbar />
      
    
       <div className="min-h-screen bg-[#0b0d24] px-3 py-4 text-white sm:px-6 sm:py-8">
  <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
    {/* Header */}
    <header className="flex items-center justify-between gap-3 border-b border-violet-500/30 pb-3 sm:pb-4">
      <div className="min-w-0">
        <h1 className="truncate bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-3xl">
          Chats
        </h1>
        <p className="mt-0.5 text-xs text-indigo-300 sm:text-sm">
          Talk with other readers and writers.
        </p>
      </div>
    </header>

    {/* Chat list container */}
    <section
      aria-label="All chats"
      className="overflow-hidden rounded-xl border border-violet-500/30 bg-[#17152f]/70 shadow-lg shadow-violet-950/40 backdrop-blur"
    >
      <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-12rem)]">
        <ViewAllChats />
      </div>
    </section>
  </div>
</div>
</>
    );
}