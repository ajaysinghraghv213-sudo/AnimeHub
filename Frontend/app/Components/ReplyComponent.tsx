import {reply} from '@/app/function/reply'
import {useState} from 'react'

type ReplyComponentProps = {
    post_id: number
}

const ReplyComponent = ({post_id}: ReplyComponentProps) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleReply = async () => {
        try {
            setLoading(true)
            const response = await reply({post_id, content})
            console.log('Reply response:', response)
        } catch (error) {
            console.error('Failed to reply:', error)
            setError(error as any)
        } finally {
            setLoading(false)
        }
    }

    return (
       <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-end">
  <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="Write a reply..."
    rows={3}
    aria-label="Reply"
    className="w-full min-h-[96px] resize-none rounded-xl border border-gray-300 bg-white
               px-4 py-3 text-base text-gray-900 placeholder:text-gray-400
               shadow-sm transition
               focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300/50
               sm:min-h-[80px] sm:resize-y"
  />
  <button
    onClick={handleReply}
    disabled={!content.trim() || loading}
    className="w-full min-h-[44px] rounded-xl bg-gradient-to-r from-pink-500 to-purple-500
               px-6 py-3 text-base font-semibold text-white shadow-md transition
               active:scale-95 hover:opacity-90
               disabled:cursor-not-allowed disabled:opacity-50
               sm:w-auto"
  >
    Reply
  </button>
</div>
    )
}

export default ReplyComponent