import type { SubmissionContent } from '../../types/assignment';
export function SubmissionContentCard({ content }: { content: SubmissionContent }) {
  if (content.type === 'video') {
    return (
      <video controls className="w-full max-w-xl rounded">
        <source src={content.url} type="video/mp4" />
        Trình duyệt không hỗ trợ phát video.
      </video>
    );
  } else if (content.type === 'document') {
    return (
      <iframe
        src={content.url}
        className="w-full h-[600px] border rounded"
        title="Document Preview"
      />
    );
  }
  return <p>Không có nội dung nộp bài.</p>;
}
