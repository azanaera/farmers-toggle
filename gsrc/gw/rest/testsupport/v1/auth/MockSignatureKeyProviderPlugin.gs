package gw.rest.testsupport.v1.auth

uses gw.api.modules.rest.framework.v1.auth.jwt.JwsAlgorithm
uses gw.api.modules.rest.framework.v1.plugin.security.SignatureKeyProviderPluginBase
uses gw.util.StreamUtil

uses javax.crypto.SecretKey
uses javax.crypto.spec.SecretKeySpec
uses java.security.PrivateKey
uses java.security.PublicKey

@Export
class MockSignatureKeyProviderPlugin extends SignatureKeyProviderPluginBase {

  var _secretKey = "abcdefghijklmnop1234567890ABCDEF"

  override function getSecretKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : SecretKey {
    if (!signatureAlgorithm.Symmetric) {
      throw new IllegalArgumentException("Not a symmetric key algorithm: ${signatureAlgorithm.AlgorithmName}")
    }
    return new SecretKeySpec(StreamUtil.toBytes(_secretKey), signatureAlgorithm.AlgorithmName)
  }

  override function getPublicKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : PublicKey {
    throw new UnsupportedOperationException("MockSignatureKeyProviderPlugin does not support getPublicKey")
  }

  override function getPrivateKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : PrivateKey {
    return null
  }
}