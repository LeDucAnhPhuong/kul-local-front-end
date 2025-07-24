using kul_local_back_end.Entities;
using kul_locall_back_end.Entities;
using kul_locall_back_end.models.register;

namespace kul_locall_back_end
{
    public interface IRegister : IRepository<Register>
    {
        public Task<IResult> GetRegisterTedTeam(string assignEmail);
        public Task<IResult> RegisterTedTeamAsync(RegisterTedTeamDTO registerDTO, string email);
        public Task<IResult> UnregisterTedTeamAsync(RegisterTedTeamDTO registerDTO, string email);

        public Task<IResult> GetAllRegisteredTeamsAsync();

        public Task<IResult> AcceptRegister(string registerId);

        public Task<IResult> RejectRegister(string registerId);

    }
}
