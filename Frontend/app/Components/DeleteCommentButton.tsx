import { deleteComment } from '@/app/function/comments';
import { toast } from 'sonner';

interface DeleteCommentButtonProps {
    commentId: string | number;
    onDelete: () => void;
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await deleteComment(commentId);
            onDelete();
            toast.success('Comment deleted');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete comment');
        }
    };

    return (
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            Delete
        </button>
    );
};

export default DeleteCommentButton;