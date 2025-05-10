import { BlogTagResponse } from '@/types/tag.type';
import { Pagination } from '@/types/utils.type';

export enum BlogType {
  Article,
  PhotoPost
};

export enum MediaType {
  Photo,
  PhotoFile
};

export interface CreateBlogDTO {
  title: string;
  content: string;
  blogType: string;
  blogMedia: {
    mediaType: string;
    mediaId: string;
    mediaPosition: number;
  }[];
}

export interface BlogRequest {
  title?: string;
  blogType?: BlogType;
  tags?: string[];
  skip: number;
  take: number;
}

export interface Blog {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  blogType: BlogType;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  blogMedia: BlogMedia[];
  tags: BlogTagResponse[];
}

export interface BlogListResponse {
  data: Blog[];
  pagination: Pagination;
}

export interface BlogMedia {
  id: string;
  blogId: string;
  mediaType: MediaType;
  mediaId: string;
  mediaPosition: number;
  createdAt: Date;
  updatedAt: Date;
}
