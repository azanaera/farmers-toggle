package gw.surepath.suite.integration.logging

uses gw.lang.reflect.features.BoundPropertyReference
uses gw.lang.reflect.features.FeatureReference
uses gw.pl.logging.LoggerCategory
uses org.slf4j.Logger
uses org.slf4j.LoggerFactory
uses org.slf4j.MDC

/**
 * Wrapper around Logger that formats log messages for consistency.
 */
class StructuredLogger {
  // Static loggers that wrap the existing LoggerCategory loggers
  public static final var PLUGIN : StructuredLogger = new StructuredLogger(LoggerCategory.PLUGIN)
  public static final var MESSAGING : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING)
  public static final var MESSAGING_LEASE : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_LEASE)
  public static final var MESSAGING_LEASE_EVENT : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_LEASE_EVENT)
  public static final var MESSAGING_DESTMGR : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_DESTMGR)
  public static final var MESSAGING_MESSAGE : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_MESSAGE)
  public static final var MESSAGING_PREPROCESSOR : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_PREPROCESSOR)
  public static final var MESSAGING_PREPROCESSOR_NODE : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_PREPROCESSOR_NODE)
  public static final var MESSAGING_PERF : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_PERF)
  public static final var MESSAGING_EXAMPLES : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_EXAMPLES)
  public static final var API : StructuredLogger = new StructuredLogger(LoggerCategory.API)
  public static final var PROFILER : StructuredLogger = new StructuredLogger(LoggerCategory.PROFILER)
  public static final var CONFIG : StructuredLogger = new StructuredLogger(LoggerCategory.CONFIG)
  public static final var TOOLS : StructuredLogger = new StructuredLogger(LoggerCategory.TOOLS)
  public static final var CONFIG_DISPLAY : StructuredLogger = new StructuredLogger(LoggerCategory.CONFIG_DISPLAY)
  public static final var CONFIG_UPGRADER : StructuredLogger = new StructuredLogger(LoggerCategory.CONFIG_UPGRADER)
  public static final var CONFIG_SERVICE : StructuredLogger = new StructuredLogger(LoggerCategory.CONFIG_SERVICE)
  public static final var TEST : StructuredLogger = new StructuredLogger(LoggerCategory.TEST)
  public static final var TEST_DATABASE : StructuredLogger = new StructuredLogger(LoggerCategory.TEST_DATABASE)
  public static final var RULES : StructuredLogger = new StructuredLogger(LoggerCategory.RULES)
  public static final var INTEGRATION : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION)
  public static final var INTEGRATION_WORKAGENT : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION_WORKAGENT)
  public static final var INTEGRATION_MSGREPLY : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION_MSGREPLY)
  public static final var INTEGRATION_JMS : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION_JMS)
  public static final var INTEGRATION_FILE : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION_FILE)
  public static final var INTEGRATION_CUSTOM : StructuredLogger = new StructuredLogger(LoggerCategory.INTEGRATION_CUSTOM)
  public static final var KPI : StructuredLogger = new StructuredLogger(LoggerCategory.KPI)
  public static final var MESSAGING_KPI : StructuredLogger = new StructuredLogger(LoggerCategory.MESSAGING_KPI)
  public static final var KPI_PROFILER : StructuredLogger = new StructuredLogger(LoggerCategory.KPI_PROFILER)
  public static final var IL_CONFIG : StructuredLogger = new StructuredLogger(LoggerCategory.IL_CONFIG)

  private var _logger : Logger

  /**
   * Construct a StructuredLogger from an existing logger.
   *
   * @param logger the existing logger.
   */
  protected construct(logger : Logger) { _logger = logger }

  /**
   * Determine whether trace logging is enabled.
   *
   * @return true if trace logging is enabled, false if not.
   */
  public property get TraceEnabled() : boolean {return _logger.TraceEnabled}

  /**
   * Determine whether debug logging is enabled.
   *
   * @return true if debug logging is enabled, false if not.
   */
  public property get DebugEnabled() : boolean {return _logger.DebugEnabled}

  /**
   * Determine whether info logging is enabled.
   *
   * @return true if info logging is enabled, false if not.
   */
  public property get InfoEnabled() : boolean {return _logger.InfoEnabled}

  /**
   * Determine whether warn logging is enabled.
   *
   * @return true if warn logging is enabled, false if not.
   */
  public property get WarnEnabled() : boolean {return _logger.WarnEnabled}

  /**
   * Determine whether error logging is enabled.
   *
   * @return true if error logging is enabled, false if not.
   */
  public property get ErrorEnabled() : boolean {return _logger.ErrorEnabled}

  /**
   * Get the logger category name.
   *
   * @return the logger category name.
   */
  public property get Name() : String {return _logger.Name}

  /**
   * Create a StructuredLogger for a subcategory of this StructuredLogger.
   *
   * @param subcategory the subcategory name.
   * @return a new StructuredLogger.
   */
  public function createSubcategoryLogger(subcategory : String) : StructuredLogger {
    var sublog = LoggerFactory.getLogger(this._logger.Name + "." + subcategory)
    return new StructuredLogger(sublog)
  }

  /**
   * Set logging context and evaluate an operation.
   *
   * @param blk the operation, which evaluates to type T.
   * @param parameters a map of key/value pairs to add to the logging context.
   * @return the result of the operation.
   */
  public static function evaluateWithContext<T extends Object>(blk : block() : T, parameters : Map<String, String>) : T {
    try {
      if ((parameters != null) && !parameters.Empty) {
        parameters.eachKeyAndValue(\key, value -> MDC.put(key, value))
      }
      return blk()
    }
    finally {
      if ((parameters != null) && !parameters.Empty) {
        parameters.eachKey(\key -> MDC.remove(key))
      }
    }
  }

  /**
   * Set logging context and execute an operation.
   *
   * @param blk the operation, which has no return value.
   * @param parameters a map of key/value pairs to add to the logging context.
   */
  public static function executeWithContext(blk : block(), parameters : Map<String, String>) {
    try {
      if ((parameters != null) && !parameters.Empty) {
        parameters.eachKeyAndValue(\key, value -> MDC.put(key, value))
      }
      blk()
    }
    finally {
      if ((parameters != null) && !parameters.Empty) {
        parameters.eachKey(\key -> MDC.remove(key))
      }
    }
  }

  /**
   * Log a trace message.
   *
   * @param msg the log message.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   */
  public function trace(msg : String,
                        objects : List<Object> = null,
                        parameters : Map<String, String> = null) {
    if (TraceEnabled) {
      _logger.trace(formatMessage(msg, objects, parameters))
    }
  }

  /**
   * Log a debug message.
   *
   * @param msg the log message.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   */
  public function debug(msg : String,
                        objects : List<Object> = null,
                        parameters : Map<String, String> = null) {
    if (DebugEnabled) {
      _logger.debug(formatMessage(msg, objects, parameters))
    }
  }

  /**
   * Log an info message.
   *
   * @param msg the log message.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   * @param method an optional reference to the method calling this log statement.
   */
  public function info(msg : String,
                       objects : List<Object> = null,
                       parameters : Map<String, String> = null,
                       method : FeatureReference = null) {
    if (InfoEnabled) {
      _logger.info(formatMessage(msg, objects, parameters, method))
    }
  }

  /**
   * Log a warn message.
   *
   * @param msg the log message.
   * @param method a reference to the method calling this log statement.
   * @param ex an optional Exception.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   */
  public function warn(msg : String,
                       method : FeatureReference,
                       ex : Exception = null,
                       objects : List<Object> = null,
                       parameters : Map<String, String> = null) {
    if (WarnEnabled) {
      if (ex == null) {
        _logger.warn(formatMessage(msg, objects, parameters, method))
      }
      else {
        _logger.warn(formatMessage(msg, objects, parameters, method), ex)
      }
    }
  }

  /**
   * Log an error message.
   *
   * @param msg the log message.
   * @param method an optional reference to the method calling this log statement.
   * @param ex an optional Exception.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   */
  public function error(msg : String,
                        method : FeatureReference,
                        ex : Exception = null,
                        objects : List<Object> = null,
                        parameters : Map<String, String> = null) {
    if (ErrorEnabled) {
      if (ex == null) {
        _logger.error(formatMessage(msg, objects, parameters, method))
      }
      else {
        _logger.error(formatMessage(msg, objects, parameters, method), ex)
      }
    }
  }

  /**
   * Format a log message string.
   *
   * @param msg the log message.
   * @param objects an optional list of objects, entities, or BoundPropertyReferences to add to the log message.
   * @param parameters an optional map of additional key/value pairs to add to the log message.
   * @param method a reference to the method calling this log statement.
   * @return the formatted message string.
   */
  protected function formatMessage(msg : String,
                                 objects : List<Object> = null,
                                 parameters : Map<String, String> = null,
                                 method : FeatureReference = null) : String {
    var builder = new StringBuilder(msg)
    appendMethod(builder, method)
    appendObjects(builder, objects)
    appendParameters(builder, parameters)
    return builder.toString()
  }

  private function appendMethod(builder: StringBuilder, method : FeatureReference) {
    if (method != null) {
      var info = method.FeatureInfo
      builder.append(" [Method=${info.Container.DisplayName}#${info.DisplayName}]")
    }
  }

  private function appendObjects(builder : StringBuilder, objects : List<Object>) {
    if (objects != null) {
      for (obj in objects) {
        if (obj typeis KeyableBean) {
          builder.append(" [${obj.IntrinsicType.DisplayName}=${obj.PublicID}]")
        }
        else if (obj typeis BoundPropertyReference) {
          var onm = obj.FeatureInfo.OwnersType.RelativeName
          var pid = (obj.Ctx typeis KeyableBean) ? "(${obj.Ctx.PublicID})" : ""
          var pnm = obj.PropertyInfo.Name
          var pval = obj.PropertyInfo.Accessor.getValue(obj.Ctx).toString()
          builder.append(" [${onm}${pid}#${pnm}=${pval}]")
        }
        else {
          builder.append(" [${obj.Class.Name}=${obj.toString()}]")
        }
      }
    }
  }

  private function appendParameters(builder : StringBuilder, parameters : Map<String, String>) {
    if (parameters != null) {
      parameters.eachKeyAndValue(\key, value -> builder.append(" [${key}=${value}]"))
    }
  }
}