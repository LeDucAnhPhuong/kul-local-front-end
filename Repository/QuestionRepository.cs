using ClosedXML.Excel;
using kul_local_back_end.Entities;
using kul_local_back_end.models.question;
using kul_local_back_end.Repository;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace kul_local_back_end.Repositories
{

    public class QuestionRepository : BaseRepository<Question>, IQuestionRepository
    {
        private readonly QuizRepository _quizRepository;
        public QuestionRepository(IMongoDatabase db, string collectionName, QuizRepository quizRepository) : base(db, collectionName)
        {
            _quizRepository = quizRepository;
        }

        public async Task<IResult> CreateQuestionAsync(CreateQuestionDTO question)
        {
            var quiz = await _quizRepository.GetQuizById(question.QuizId);

            if (quiz == null)
            {
                return Results.NotFound(new { message = "Quiz not found." });
            }

            var newQuestion = new Question
            {
                QuizId = question.QuizId,
                Type = question.Type,
                QuestionText = question.QuestionText,
                Options = question.Options,
                SelectContent = question.SelectContent,
                Pairs = question.Pairs,
                FillInBlank = question.FillInBlank,
            };
            var result = await CreateAsync(newQuestion);

            return result != null
                ? Results.Ok(new { message = "Question created successfully", data = result })
                : Results.BadRequest(new { message = "Failed to create question" });
        }

        public async Task<IResult> UpdateQuestionAsync(string id, UpdateQuestionDTO updateAction)
        {
            var result =  await UpdateAsync(id, question =>
            {
                question.QuestionText = updateAction.QuestionText ?? question.QuestionText;
                question.Options = updateAction.Options != null ? updateAction.Options : question.Options;
                question.SelectContent = updateAction.SelectContent ?? question.SelectContent;
                question.Pairs = updateAction.Pairs ?? question.Pairs;
                question.FillInBlank = updateAction.FillInBlank ?? question.FillInBlank;

            });

            if(result == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { message = "Question updated successfully", data = result });
        }

        public async Task<IResult> GetQuestionByIdAsync(string id)
        {

            var question = await GetByIdAsync(id);

            if (question == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { data = question });
        }

        public async Task<IResult> GetQuestionsByQuizIdAsync(string quizId)
        {
            var filter = Builders<Question>.Filter.Eq(q => q.QuizId, quizId);
            var results = await GetByFilterAsync(filter);
            return Results.Ok(new { data = results });
        }

        public async Task<IResult> DeleteQuestionAsync(string id)
        {
            var question = await DeleteAsync(id);
            if (question == null)
            {
                return Results.NotFound(new { message = "Question not found." });
            }

            return Results.Ok(new { message = "Question deleted successfully", data = question });
        }

        public async Task<IResult> ExportQuestions(string quizId)
        {
            var questions = await GetByFilterAsync(Builders<Question>.Filter.Eq(q => q.QuizId, quizId));
            if (questions == null || !questions.Any())
                return Results.NotFound(new { message = "No questions found." });

            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Questions");

            worksheet.Cell(1, 1).Value = "QuestionType";
            worksheet.Cell(1, 2).Value = "QuestionText";
            worksheet.Cell(1, 3).Value = "Options";
            worksheet.Cell(1, 4).Value = "CorrectAnswers";
            worksheet.Cell(1, 5).Value = "SelectContent";
            worksheet.Cell(1, 6).Value = "SelectOptions";
            worksheet.Cell(1, 7).Value = "SelectCorrectAnswers";
            worksheet.Cell(1, 8).Value = "FillBlankContent";
            worksheet.Cell(1, 9).Value = "FillBlankAnswers";
            worksheet.Cell(1, 10).Value = "PairLeft";
            worksheet.Cell(1, 11).Value = "PairRight";
            worksheet.Cell(1, 12).Value = "PairCorrect";

            int row = 2;
            foreach (var q in questions)
            {
                worksheet.Cell(row, 1).Value = q.Type.ToString();
                worksheet.Cell(row, 2).Value = q.QuestionText;

                if (q.Type is QuestionType.SingleChoice or QuestionType.MultipleChoice)
                {
                    worksheet.Cell(row, 3).Value = string.Join(";;", q.Options?.Option ?? new());
                    worksheet.Cell(row, 4).Value = string.Join(";;", q.Options?.CorrectAnswers ?? new());
                }

                if (q.Type == QuestionType.SelectInText)
                {
                    worksheet.Cell(row, 5).Value = q.SelectContent?.Content ?? "";
                    worksheet.Cell(row, 6).Value = string.Join("||", q.SelectContent?.Options?.Select(o => string.Join(";;", o.value ?? new()) + "::" + o.CorrectAnswer) ?? new List<string>());
                }

                if (q.Type == QuestionType.Fillblank)
                {
                    worksheet.Cell(row, 8).Value = q.FillInBlank?.content ?? "";
                    worksheet.Cell(row, 9).Value = string.Join(";;", q.FillInBlank?.CorrectAnswers ?? new());
                }

                if (q.Type == QuestionType.PairKey)
                {
                    worksheet.Cell(row, 10).Value = string.Join(";;", q.Pairs?.Left ?? new());
                    worksheet.Cell(row, 11).Value = string.Join(";;", q.Pairs?.Right ?? new());
                    worksheet.Cell(row, 12).Value = string.Join("||", q.Pairs?.CorrectAnswers?.Select(p => string.Join("::", p)) ?? new List<string>());
                }

                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);
            return Results.File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"quiz_{quizId}_questions.xlsx");
        }

        public async Task<IResult> ImportQuestions(string quizId, IFormFile file)
        {
            var existQuiz = await _quizRepository.GetQuizById(quizId);

            if (existQuiz == null) return Results.BadRequest(new { message = "Invalid quiz." });

            if (file == null || file.Length == 0)
                return Results.BadRequest(new { message = "Invalid file." });

            using var stream = file.OpenReadStream();
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);

            var questions = new List<Question>();

            foreach (var row in worksheet.RowsUsed().Skip(1))
            {
                var typeStr = row.Cell("A").GetString();
                if (!Enum.TryParse<QuestionType>(typeStr, true, out var type)) continue;

                var question = new Question
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    QuizId = quizId,
                    Type = type,
                    QuestionText = row.Cell("B").GetString(),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                switch (type)
                {
                    case QuestionType.SingleChoice:
                    case QuestionType.MultipleChoice:
                        question.Options = new MultipleChoiceOption
                        {
                            Option = row.Cell("C").GetString().Split(";;").ToList(),
                            CorrectAnswers = row.Cell("D").GetString().Split(";;").ToList()
                        };
                        break;

                    case QuestionType.SelectInText:
                        question.SelectContent = new SelectContent
                        {
                            Content = row.Cell("E").GetString(),
                            Options = row.Cell("F").GetString().Split("||").Select(option =>
                            {
                                var parts = option.Split("::");
                                return new SelectPlaceholder
                                {
                                    value = parts[0].Split(";;").ToList(),
                                    CorrectAnswer = parts.Length > 1 ? parts[1] : ""
                                };
                            }).ToList()
                        };
                        break;

                    case QuestionType.Fillblank:
                        question.FillInBlank = new FillBlank
                        {
                            content = row.Cell("H").GetString(),
                            CorrectAnswers = row.Cell("I").GetString().Split(";;").ToList()
                        };
                        break;

                    case QuestionType.PairKey:
                        question.Pairs = new PairOption
                        {
                            Left = row.Cell("J").GetString().Split(";;").ToList(),
                            Right = row.Cell("K").GetString().Split(";;").ToList(),
                            CorrectAnswers = row.Cell("L").GetString().Split("||")
                                .Select(pair => pair.Split("::").ToList()).ToList()
                        };
                        break;
                }

                questions.Add(question);
            }

            await GetCollection().InsertManyAsync(questions);
            return Results.Ok(new { message = "Questions imported successfully", count = questions.Count });
        }



    }
}
