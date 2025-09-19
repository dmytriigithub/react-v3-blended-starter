import axios from "axios";
import { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
export const limit = 8;

interface PostsHTTPResponse {
  posts: Post[];
  totalCount: number;
}
interface PostsHTTPRequest {
  title: string;
  body: string;
}

export const fetchPosts = async (searchText: string, page: number): Promise<PostsHTTPResponse> => {
  const response = await axios.get<Post[]>("posts", {
    params: {
      q: searchText,
      _page: page,
      _limit: limit,
    },
  });

  const totalCount = Number(response.headers["x-total-count"]);

  return {
    posts: response.data,
    totalCount,
  };
};

export const createPost = async (newPost: PostsHTTPRequest) => {
  const response = await axios.post(`posts`, newPost);
  return response.data;
};

export const editPost = async (newDataPost: Post) => {
  const response = await axios.patch(`posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await axios.delete(`posts/${postId}`);
  return response.data;
};
