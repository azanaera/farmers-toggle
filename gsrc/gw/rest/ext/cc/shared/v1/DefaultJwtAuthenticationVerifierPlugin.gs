package gw.rest.ext.cc.shared.v1

uses gw.api.modules.rest.framework.v1.auth.jwt.matchers.InternalUserMatcher
uses gw.api.modules.rest.framework.v1.auth.jwt.matchers.ServiceMatcher
uses gw.api.modules.rest.framework.v1.auth.jwt.matchers.UserTypeMatcher
uses gw.rest.api.auth.BaseJwtAuthenticationVerifierPlugin
uses gw.rest.core.cc.shared.v1.GwabuidMatcher
uses gw.rest.core.cc.shared.v1.PolicyNumbersMatcher

@Export
class DefaultJwtAuthenticationVerifierPlugin extends BaseJwtAuthenticationVerifierPlugin {
  private static final var MATCHERS = List.of(
      new InternalUserMatcher("cc_username"),
      new PolicyNumbersMatcher(),
      new GwabuidMatcher(),
      new ServiceMatcher()
  )

  protected override property get ExplicitMatchers() : List<UserTypeMatcher> {
    return MATCHERS
  }

  override property get ApplicationPrefix() : String {
    return "cc."
  }
}