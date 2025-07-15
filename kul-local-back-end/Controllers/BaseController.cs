using System.Web.Http.Filters;

public class AllowCrossSiteJsonAttribute : System.Web.Http.Filters.ActionFilterAttribute
{
    public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
    {
        if (actionExecutedContext.Response != null)
            actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");

        base.OnActionExecuted(actionExecutedContext);
    }
}