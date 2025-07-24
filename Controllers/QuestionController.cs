using Microsoft.AspNetCore.Mvc;
using kul_local_back_end.Entities;
using kul_local_back_end.models.question;
using kul_local_back_end.Repositories;

namespace kul_local_back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepo;

        public QuestionController(IQuestionRepository questionRepo)
        {
            _questionRepo = questionRepo;
        }

        [HttpPost("create")]
        public async Task<IResult> Create(CreateQuestionDTO dto)
        {
            return await _questionRepo.CreateQuestionAsync(dto);
        }

        [HttpPut("{id}")]
        public async Task<IResult> Update(string id,  UpdateQuestionDTO dto)
        {
            return await _questionRepo.UpdateQuestionAsync(id, dto);
        }

        [HttpGet("{id}")]
        public async Task<IResult> GetById(string id)
        {
            return await _questionRepo.GetQuestionByIdAsync(id);
        }

        [HttpGet("quiz/{quizId}")]
        public async Task<IResult> GetByQuizId(string quizId)
        {
            return await _questionRepo.GetQuestionsByQuizIdAsync(quizId);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(string id)
        {
            return await _questionRepo.DeleteQuestionAsync(id);
        }
    }
}
