import api from '@/lib/utils/api.util';
import { Blog, BlogRequest, BlogListResponse } from '@/types/blog.type';

export const blogApi = {
  /**
   * Fetches a list of blogs based on provided filters
   * @param filters - Search filters for blogs
   */
  getBlogList: async (filters: Partial<BlogRequest>) =>
    api.get<BlogListResponse>('/v1/blogs', {
      params: {
        title: filters.title || undefined,
        blogType: filters.blogType !== undefined ? filters.blogType : undefined,
        tags: filters.tags || undefined,
        skip: filters.skip || 0,
        take: filters.take || 10
      }
    }),

  /**
   * Fetch a single blog by ID
   * @param id - Blog ID
   */
  getBlog: async (id: string) =>
    api.get<Blog>(`/v1/blogs/${id}`),
    
  /**
   * Delete a blog
   * @param id - Blog ID
   */
  deleteBlog: async (id: string) =>
    api.delete(`/v1/blogs/${id}`),

  /**
   * Fetches a list of blogs from another user using shared context
   * @param userId - ID of the user whose blogs to fetch
   * @param filters - Search filters for blogs
   */
  privateGetBlogList: async (userId: string, filters: Partial<BlogRequest> = {}) =>
    api.post<BlogListResponse>('/v1/shared-user/request', {
      requestToUserInfo: {
        id: userId,
      },
      requestUrl: '/v1/blogs',
      requestMethod: 'GET',
      requestHeaders: { 'Content-Type': 'application/json' }
    }),

  /**
   * Fetch a single blog by ID from another user using shared context
   * @param userId - ID of the user whose blog to fetch
   * @param blogId - Blog ID
   */
  privateGetBlog: async (userId: string, blogId: string) =>
    api.post<Blog>('/v1/shared-user/request', {
      requestToUserInfo: {
        id: userId,
      },
      requestUrl: `/v1/blogs/${blogId}`,
      requestMethod: 'GET',
      requestHeaders: { 'Content-Type': 'application/json' }
    })
};