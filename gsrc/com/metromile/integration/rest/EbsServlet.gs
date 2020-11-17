package com.metromile.integration.rest
uses gw.servlet.Servlet
uses javax.servlet.http.HttpServlet
uses javax.servlet.http.HttpServletResponse
uses javax.servlet.http.HttpServletRequest

@Servlet(\path: String -> path.matches("/ebs/integration"))
class EbsServlet extends HttpServlet {
  override function doPost(req: HttpServletRequest, resp: HttpServletResponse) {
    var user: User = null
    try {
      user = gw.servlet.ServletUtils.getBasicAuthenticatedUser(req)
    } catch (e) {
      resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      resp.Writer.write("{\"success\": \"false\", \"message\": \"Unauthorized. HTTP Basic authentication error.\"}");
      return
    }
    if (user == null) {
      resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED)
      resp.Writer.write("{\"success\": \"false\", \"message\": \"Unauthorized. No valid user with session context or HTTP Basic.\"}");
      return
    }
    var requestProcessor = new com.metromile.ebs.gw.RequestProcessor();
    requestProcessor.processRequest(req, resp);
  }
}