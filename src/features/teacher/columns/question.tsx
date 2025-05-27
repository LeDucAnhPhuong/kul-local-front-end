export interface QuestionProps {
  _id?: string;
  quiz_id: string;
  content: string;
  options: string[];              // Danh sách đáp án
  correct_answer: string;         // Đáp án đúng
  score: number;
  isActive: boolean;
  created_by: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class Question implements QuestionProps {
  _id?: string;
  quiz_id: string;
  content: string;
  options: string[];
  correct_answer: string;
  score: number;
  isActive: boolean;
  created_by: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: QuestionProps) {
    this._id = data._id;
    this.quiz_id = data.quiz_id;
    this.content = data.content;
    this.options = data.options;
    this.correct_answer = data.correct_answer;
    this.score = data.score;
    this.isActive = data.isActive;
    this.created_by = data.created_by;
    this.updated_by = data.updated_by;
    this.created_at = data.created_at ?? new Date();
    this.updated_at = data.updated_at ?? new Date();
  }

  // Cập nhật nội dung câu hỏi
  updateContent(newContent: string) {
    this.content = newContent;
    this.updated_at = new Date();
  }

  // Cập nhật đáp án đúng
  setCorrectAnswer(answer: string) {
    if (this.options.includes(answer)) {
      this.correct_answer = answer;
      this.updated_at = new Date();
    } else {
      throw new Error('Correct answer must be one of the options');
    }
  }

  // Thêm lựa chọn mới
  addOption(option: string) {
    this.options.push(option);
    this.updated_at = new Date();
  }

  // Xoá lựa chọn
  removeOption(option: string) {
    this.options = this.options.filter(o => o !== option);
    if (this.correct_answer === option) {
      this.correct_answer = '';
    }
    this.updated_at = new Date();
  }

  // Kích hoạt / hủy kích hoạt câu hỏi
  toggleActive() {
    this.isActive = !this.isActive;
    this.updated_at = new Date();
  }
}
