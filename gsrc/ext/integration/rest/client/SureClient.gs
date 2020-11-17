package ext.integration.rest.client

uses com.surepolicy.rest.ApiClient
uses com.surepolicy.rest.api.SurePolicyApi
uses com.surepolicy.rest.util.RequestInterceptorMultipartForm
uses com.surepolicy.rest.util.RequestInterceptorReplaceNulls
uses ext.integration.rest.properties.SurePASProperties
uses feign.Feign.Builder
uses feign.FeignException
uses feign.Request.Options
uses feign.httpclient.ApacheHttpClient
uses gw.api.system.server.ServerUtil
uses gw.api.util.DisplayableException
uses gw.surepath.suite.integration.credentials.SecretsManagerService
uses gw.surepath.suite.integration.logging.StructuredLogger

uses java.util.concurrent.TimeUnit

class SureClient {

  private static final var TOKEN_AUTH_SECURITY = "Token"
  private static final var LOCAL = "local"
  private static final var PATH_SECRET_KEY = "tog.sure.path"
  private static final var TOKEN_SECRET_KEY = "tog.sure.token"
  private static final var IS_LOCAL = ServerUtil.Env.equalsIgnoreCase(LOCAL)
  private var path : String
  private var token : String
  private static var _properties = new SurePASProperties()
  private static var _logger = StructuredLogger.INTEGRATION

  /**
   * Adds Path, Authentication, and updates Headders for Sure REST API call
   *
   * @return SurePolicyApi REST Client
   * @throws(FeignException, "If there is an error thrown when creating sure client")
   */
  public function createClient() : SurePolicyApi {
    var auths = new String[1]
    auths[0] = TOKEN_AUTH_SECURITY

    var apiClient = new ApiClient(auths)
    if (IS_LOCAL) {
      token = _properties.SurePASToken
    } else {
      token = SecretsManagerService.getSensitiveProperty(TOKEN_SECRET_KEY)
    }
    path = _properties.SurePASPath

    try {
      apiClient.setBearerToken(token)
      apiClient.setFeignBuilder(getBuilder(apiClient.getFeignBuilder(), path))
      apiClient.addInterceptor("RequestInterceptorReplaceNulls", new RequestInterceptorReplaceNulls())
      apiClient.addInterceptor("RequestInterceptorMultipartForm", new RequestInterceptorMultipartForm())
      apiClient.setBasePath(path)
      var contentTypes = new String[1]
      contentTypes[0] = "application/json"
      apiClient.selectHeaderContentType(contentTypes)

      var api = apiClient.buildClient(SurePolicyApi)

      return api
    } catch (exception : FeignException) {
      _logger.error("Error occured when creating SureApi Client", #createClient(), exception)
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ${ServerUtil.systemDateTime().toString()}, Error Code: ${exception.status()}")
    } catch (exception : Exception) {
      _logger.error("Error occured when creating SureApi Client", #createClient(), exception)
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ${ServerUtil.systemDateTime().toString()}, Error Code: ${exception.Message}")
    }

  }

  /**
   * Generates the FeignBuilder and sets connection parameeters for the REST Client
   *
   * @param builder  the API Client fegn builder
   * @param basePath base URL for REST Client
   * @return FeignBuilder
   */
  private static function getBuilder(builder : Builder, basePath : String) : Builder {

    var connectionTimeOut = 30
    var readTimeOut = 30
    var followRedirects = true

    var options = new Options(connectionTimeOut, TimeUnit.SECONDS, readTimeOut, TimeUnit.SECONDS, followRedirects)

    builder.options(options)

    builder.client(new ApacheHttpClient())
    builder.target(SurePolicyApi, basePath)

    return builder

  }

}