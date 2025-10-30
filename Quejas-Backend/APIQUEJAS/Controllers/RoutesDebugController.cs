using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;

[AllowAnonymous]
[RoutePrefix("API/debug")]
public class RoutesDebugController : ApiController
{
    private readonly IApiExplorer _api;

    public RoutesDebugController()
    {
        _api = GlobalConfiguration.Configuration.Services.GetApiExplorer();
    }

    [HttpGet, Route("routes")]
    public IHttpActionResult GetRoutes()
    {
        var list = _api.ApiDescriptions
            .Select(d => new
            {
                HttpMethod = d.HttpMethod.Method,
                RelativePath = "/" + d.RelativePath,      // p.ej. API/USUARIOPUNTOATENCION/ObtenerUsuarios
                Controller = d.ActionDescriptor.ControllerDescriptor.ControllerName,
                Action = d.ActionDescriptor.ActionName
            })
            .OrderBy(x => x.RelativePath).ThenBy(x => x.HttpMethod)
            .ToList();

        return Ok(list);
    }
}
