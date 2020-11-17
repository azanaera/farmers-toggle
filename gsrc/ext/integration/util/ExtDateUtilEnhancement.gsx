package ext.integration.util

uses com.sun.org.slf4j.internal.LoggerFactory
uses gw.api.util.DateUtil

uses java.text.SimpleDateFormat

enhancement ExtDateUtilEnhancement : DateUtil {

  public static function UTCDateStringToDate(aDateStr : String) : Date {

    var retDateVal : Date
    if (aDateStr != null) {
      if (aDateStr.contains("T")) {
        var existingUTCFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        retDateVal = existingUTCFormat.parse(aDateStr)
      }
      else {
        var dateElems = aDateStr.split("-")
        retDateVal = DateUtil.createDateInstance(Integer.parseInt(dateElems[1]), Integer.parseInt(dateElems[2]), Integer.parseInt(dateElems[0]))
      }
    }

    return retDateVal
  }

  public static function dateToYYYY_MM_DD_Ext(aDate : Date) : String {

    var retDateStr : String
    if (aDate != null) {
      var sdf = new SimpleDateFormat("yyyy-MM-dd")
      retDateStr = sdf.format(aDate)
    }

    return retDateStr
  }

}
