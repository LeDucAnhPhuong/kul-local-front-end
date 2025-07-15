namespace kul_local_back_end.models.quiz
{
    public class CreateQuizDTO
    {
        public string Title { get; set; }
        public DateTime Date { get; set; }       
        public DateTime Due { get; set; }          
        public bool IsPublic { get; set; }        
    }
}
