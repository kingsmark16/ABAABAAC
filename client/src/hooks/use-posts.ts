import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import type { PostFormData } from '@/types/post';

const POSTS_QUERY_KEY = ['admin', 'posts'] as const;

/** Fetch all posts */
export function usePosts() {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: adminService.getPosts,
  });
}

/** Create a new post */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: PostFormData) => adminService.createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

/** Update (delete + recreate) a post */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, formData }: { postId: string; formData: PostFormData }) =>
      adminService.updatePost(postId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

/** Delete a post */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => adminService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}
