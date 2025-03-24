export interface Tag {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoTagResponse {
  photoId: string;
  tagId: string;
  tags: {
    name: string;
  }
}

