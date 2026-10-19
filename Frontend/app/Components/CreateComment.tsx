

import { postComment } from '@/app/function/comments';
import {useState,useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { setComments } from '@/app/redux/features/comments';
import { toast } from 'sonner';
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";



const CreateComment = ({ articleId }: { articleId: number }) => {
    const [comment, setComment] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const comments = useSelector((state: any) => state.comments.comments);
    const dispatch = useDispatch();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Write a comment before submitting');
            return;
        }
        try {
            const newComment = await postComment(articleId, comment);
            dispatch(setComments([...comments, newComment]));
            setComment('');
            setShowEmojiPicker(false);
            toast.success('Comment posted');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to post comment');
        }
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









    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-lg border border-violet-500/30 bg-[#0b0d24]/55 p-3"
        >
            <div className="mb-2">
                <div>
                    <p className="text-sm font-semibold text-white">Add a comment</p>
                    <p className="mt-1 hidden text-xs leading-5 text-indigo-300 sm:block">Keep it useful, kind, and on topic.</p>
                </div>
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                aria-label="Write a comment"
                rows={2}
                className="min-h-16 w-full resize-y rounded-lg border border-violet-500/35 bg-[#17152f] px-3 py-2.5 text-base leading-6 text-white outline-none transition placeholder:text-indigo-400 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15 sm:min-h-20 sm:text-sm"
            />
            <div className="mt-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-violet-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                    {showEmojiPicker ? "Close" : "Add Emoji"}
                </button>
                <button
                    type="submit"
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:flex-none"
                >
                    Post comment
                    <span className="ml-2" aria-hidden="true">-&gt;</span>
                </button>
            </div>
             {showEmojiPicker && (
    <div className="mt-2 w-full overflow-hidden rounded-lg border border-violet-500/30">
        <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emojiData: EmojiClickData) =>
                setComment((prev) => prev + emojiData.emoji)
            }
            width="100%"
            height={isDesktop ? 280 : 260}
            lazyLoadEmojis
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
            searchPlaceHolder="Search emoji"
            style={
                {
                    "--epr-emoji-size": isDesktop ? "28px" : "24px",
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
          
        </form>
        
    );
};

export default CreateComment;