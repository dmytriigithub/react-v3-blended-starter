import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import toast from "react-hot-toast";
import { deletePost } from "../../services/postService";

interface PostListProps {
  posts: Post[];
  onOpen: () => void;
  toggleEditPost: (post: Post) => void;
}

export default function PostList({ posts, onOpen, toggleEditPost }: PostListProps) {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => toast.error("Failed to delete post."),
  });

  const handleDeletePost = (postId: number) => {
    mutationDelete.mutate(postId);
  };
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              className={css.edit}
              onClick={() => {
                onOpen();
                toggleEditPost(post);
              }}
            >
              Edit
            </button>
            <button className={css.delete} onClick={() => handleDeletePost(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
