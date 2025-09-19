import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts, limit } from "../../services/postService";
import { Toaster } from "react-hot-toast";
import PostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";
import { Post } from "../../types/post";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.totalCount / limit) : 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleEditPost = (post: Post) => {
    setEditedPost(post);
  };

  const updateSearchQuery = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  }, 300);

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox updateSearchQuery={updateSearchQuery} />
        {isSuccess && totalPages > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
        <button
          className={css.button}
          onClick={() => {
            openModal();
            setIsCreatePost(true);
            setIsEditPost(false);
          }}
        >
          Create post
        </button>
      </header>
      {isModalOpen && isCreatePost && (
        <Modal onClose={closeModal}>
          <PostForm onClose={closeModal} />
        </Modal>
      )}
      {isModalOpen && isEditPost && editedPost && (
        <Modal onClose={closeModal}>
          <EditPostForm post={editedPost} onClose={closeModal} />
        </Modal>
      )}

      {isSuccess && data.posts.length > 0 && (
        <PostList
          posts={data.posts}
          onOpen={() => {
            setIsCreatePost(false);
            setIsEditPost(true);
            openModal();
          }}
          toggleEditPost={toggleEditPost}
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
    </div>
  );
}
