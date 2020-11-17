package gw.suites

uses cucumber.api.CucumberOptions
uses cucumber.api.SnippetType
uses cucumber.api.junit.Cucumber
uses org.junit.runner.RunWith

@RunWith(Cucumber)
@CucumberOptions(
    :dryRun = false,
    :plugin = {"pretty",
        "html:build/test-results/CCBehaviorCucumberSuite/CucumberHTMLReport",
        "junit:build/test-results/CCBehaviorCucumberSuite/CucumberResults.xml"},
    :monochrome = true,
    :glue = {"gw.cucumber"},
    :snippets = SnippetType.CAMELCASE,
    :strict = true,
    :tags = {"@suite", "~@ignore"},
    :features = {"res/cucumber"}
)
@SuppressWarnings("unused")
@Export
class CCBehaviorCucumberSuite {}
