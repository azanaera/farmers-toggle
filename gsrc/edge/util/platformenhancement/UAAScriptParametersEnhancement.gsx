package edge.util.platformenhancement

enhancement UAAScriptParametersEnhancement: ScriptParameters {
  public static property get AuthServerUrl(): String{
    return getExternallyDefinedParameter(ScriptParameters.getParameterValue("AuthServerUrl") as String)
  }

  public static property get AuthServerPublicKeysEndpoint(): String{
    return getExternallyDefinedParameter(ScriptParameters.getParameterValue("AuthServerPublicKeysEndpoint") as String)
  }

  public static property get EnablePortalSingleSignOff(): Boolean{
    return ScriptParameters.getParameterValue("EnablePortalSingleSignOff") as Boolean
  }

  public static property get EnableUaaPortalAuthConsole(): Boolean{
    return ScriptParameters.getParameterValue("EnableUaaPortalAuthConsole") as Boolean
  }

  private static function getExternallyDefinedParameter(parameterValue : String): String {
    if (parameterValue.startsWith("$")) {
      var varName = parameterValue.substring(1)
      return System.getenv(varName) ?: parameterValue
    }
    return parameterValue
  }
}

