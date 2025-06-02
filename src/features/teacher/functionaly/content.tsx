export interface VideoSubmission {
  type: 'video';
  url: string;
}
export interface DocumentSubmission {
  type: 'document';
  url: string;
  file_name?: string;
}
