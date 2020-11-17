package gw.surepath.suite.integration.credentials

uses com.amazonaws.services.secretsmanager.AWSSecretsManagerClientBuilder
uses com.amazonaws.services.secretsmanager.model.CreateSecretRequest
uses com.amazonaws.services.secretsmanager.model.DeleteSecretRequest
uses gw.plugin.Plugins
uses gw.plugin.credentials.CredentialsPlugin
uses gw.suites.surepath.integration.SurePathIntegrationSuite
uses gw.suites.surepath.integration.SurePathIntegrationTestBase
uses gw.testharness.v3.Suites

/**
 * GUnit tests for AWS Secrets Manager credentials plugin.
 */
@Suites(SurePathIntegrationSuite.NAME)
class SecretsManagerCredentialsPluginTest extends SurePathIntegrationTestBase {
  private static final var REGION = "us-east-1"

  /**
   * Create secrets for tests.
   */
  override function beforeClass() {
    super.beforeClass()

    // Add secrets for tests, ignoring errors since they may already exist.
    // Don't delete secrets after tests, because it's cheaper to leave them
    // than to add and delete each time tests are run.
    addSecret("GuidewireSecretOne", {"guidewire.test.one" -> "test1:pass1",
                                     "guidewire.test.two" -> "invtest2:invpass2",
                                     "guidewire.test.three" -> "https:////localhost:8080/TestThree",
                                     "guidewire.test.four" -> "https:////localhost:8080/InvalidTestFour"})

    addSecret("GuidewireSecretTwo", {"guidewire.test.two" -> "test2:pass2",
                                     "guidewire.test.four" -> "https:////localhost:8080/TestFour"})
  }

  function testGeneralCredentials() {
    var plugin = Plugins.get(CredentialsPlugin)
    var credentials = plugin.retrieveUsernameAndPassword("guidewire.test.one")
    assertEquals("test1", credentials.Username)
    assertEquals("pass1", credentials.Password)
  }

  function testOverrideCredentials() {
    var plugin = Plugins.get(CredentialsPlugin)
    var credentials = plugin.retrieveUsernameAndPassword("guidewire.test.two")
    assertEquals("test2", credentials.Username)
    assertEquals("pass2", credentials.Password)
  }

  function testGeneralSensitiveProperty() {
    var secret = SecretsManagerService.getSensitiveProperty("guidewire.test.three")
    assertEquals(secret, "https:////localhost:8080/TestThree")
  }

  function testOverrideSensitiveProperty() {
    var secret = SecretsManagerService.getSensitiveProperty("guidewire.test.four")
    assertEquals(secret, "https:////localhost:8080/TestFour")
  }

  private function addSecret(name : String, secrets : Map<String, String>) {
    try {
      var json = new StringBuilder("{")
      secrets.eachKeyAndValue(\key, value -> json.append("\"${key}\":\"${value}\","))
      json.setLength(json.length() - 1)
      json.append("}")

      var client = AWSSecretsManagerClientBuilder.standard().withRegion(REGION).build()
      var rqst = new CreateSecretRequest()
      rqst.setDescription("Secret for GUnit testing")
      rqst.setName(name)
      rqst.setSecretString(json.toString())
      client.createSecret(rqst)
    }
    catch (e : Exception) {
      // Ignore exceptions
    }
  }

  private function deleteSecret(key : String) {
    try {
      var client = AWSSecretsManagerClientBuilder.standard().withRegion(REGION).build()
      var rqst = new DeleteSecretRequest()
      rqst.setSecretId(key)
      rqst.setForceDeleteWithoutRecovery(true)
      client.deleteSecret(rqst)
    }
    catch (e : Exception) {
      // Ignore exceptions
    }
  }
}