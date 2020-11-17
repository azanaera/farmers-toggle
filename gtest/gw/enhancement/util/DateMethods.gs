/**
 * Contains methods for working with dates.
 */

package gw.enhancement.util
uses com.guidewire.pl.system.dependency.PLDependencies
uses com.guidewire.testharness.mock.SystemClockMock
uses gw.api.util.DateUtil
uses gw.testharness.ChangesCurrentTime
uses gw.testharness.ChangesCurrentTimeUtil
uses gw.testharness.TestBase
uses junit.framework.Assert
uses junit.framework.TestCase

class DateMethods {

  //if today is a holiday (weekend), we will set the currenttime to last business day
  static function setTodayToLastBusinessDayIfTodayIsHoliday(test : TestCase) {
    checkCanChangeTime(test)
    var today = DateUtil.currentDate()
    if (!DateUtil.isBusinessDay(today, HolidayTagCode.TC_GENERAL, null)) {
      ChangesCurrentTimeUtil.setCurrentTime(test, DateUtil.addBusinessDays(today, -1).Time)
    }
  }

  //if today is a holiday (weekend), we will set the currenttime to next business day
  static function setTodayToNextBusinessDayIfTodayIsHoliday(test : TestCase) {
    checkCanChangeTime(test)
    var today = DateUtil.currentDate()
    if (!DateUtil.isBusinessDay(today, HolidayTagCode.TC_GENERAL, null)) {
      ChangesCurrentTimeUtil.setCurrentTime(test, DateUtil.addBusinessDays(today, 1).Time)
    }
  }

  static function setTimeForwardOneMinute(test : TestCase) {
    checkCanChangeTime(test)
    ChangesCurrentTimeUtil.setCurrentTime(test, DateUtil.currentDate().addMinutes(1).Time)
  }

  static function setTime(test : TestCase, time : Date) {
    checkCanChangeTime(test)
    ChangesCurrentTimeUtil.setCurrentTime(test, time.Time)
    var systemClock = PLDependencies.getSystemClock()
    if (systemClock typeis SystemClockMock) {
      systemClock.setSystemTime(time.Time)
    }
  }

  private static function checkCanChangeTime(test : TestCase) {
    Assert.assertTrue(not(test typeis TestBase) or (typeof test).TypeInfo.hasAnnotation(ChangesCurrentTime))
  }

}
