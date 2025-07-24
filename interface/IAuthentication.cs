public interface IAuthentication
{
    public Task<IResult> LoginWithGoogleAsync(string idToken);

}
