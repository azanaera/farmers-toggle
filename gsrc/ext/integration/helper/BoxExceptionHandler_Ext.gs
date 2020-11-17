package ext.integration.helper

uses com.box.sdk.BoxAPIResponseException
uses gw.surepath.suite.integration.logging.StructuredLogger

class BoxExceptionHandler_Ext {

  private static final var _logger = StructuredLogger.INTEGRATION

  /**
   * Exception handling based on the error code returned from the Box API
   * @param exception
   */
  static function handleBoxResponseExceptions(exception : BoxAPIResponseException) : void {
      switch(exception.ResponseCode){
        case 409 : {
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Item with the same name already exists")
        }
        case 404 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Item not found")
        }
        case 400 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Box API request parameters may be invalid")
        }
        case 401 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Box API Authorization token is not authorized")
        }
        case 403 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Appropriate permission required or the item may be blocked")
        }
        case 405 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("This Api Operation is not allowed")
        }
        case 410 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("The session may have expired")
        }
        case 411 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Content-length header was required, but not provided.")
        }
        case 412 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("The resource has been modified. Please retrieve the resource again and retry")
        }
        case 413 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Request Entity too Large")
        }
        case 415 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Media Type Unsupported")
        }
        case 429 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Request rate limit exceeded, please try again later")
        }
        case 500 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Internal Server Error")
        }
        case 503 :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Box API is Unavailable")
        }
        default :{
          _logger.error(exception.Message, #handleBoxResponseExceptions(), exception )
          throw new gw.api.util.DisplayableException("Box API Response Exception- Unknown. Check Logs")
        }
      }
  }
}