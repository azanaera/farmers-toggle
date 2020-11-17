package ext.config.check

uses gw.api.locale.DisplayKey
uses gw.api.util.LocationUtil

class CheckScreensHelper_Ext {
  /**
   *  If Address Line 1 & 2 > 50 characters and user clicks on next on Step 1
   *  If Country <> United States, trigger a hard stop message when user clicks on Next on Step 1
   *  Pay To The Order Of >  40
   * @param Check
   */
  public static function CheckAddressLinesLength(check : Check) {
    var ret : String = null
    var paytoLength :int = 40
    var addressLength :int = 50
    var lengthLines : int = 0
     if (check.PayTo != null and check.PayTo.length() > paytoLength){
      ret = DisplayKey.get("Toggle.Wizard.NewCheckWizard.PayTo_Ext")
    }
    if (check.MailingAddress.AddressLine1 != null){
      lengthLines = check.MailingAddress.AddressLine1.length()
    }
     if ( check.MailingAddress.AddressLine2 != null){
       lengthLines = lengthLines + check.getMailingAddress().AddressLine2.length()
     }
    if (lengthLines > addressLength){
      if (ret != null){
        ret = ret.concat("\n").concat(DisplayKey.get("Toggle.Wizard.NewCheckWizard.AdddressLines_Ext"))
      }
      else {
        ret = DisplayKey.get("Toggle.Wizard.NewCheckWizard.AdddressLines_Ext")
      }
    }

    if (check.MailingAddress.Country != Country.TC_US){
      if (ret != null){
        ret = ret.concat("\n").concat(DisplayKey.get("Toggle.Wizard.NewCheckWizard.NonUS_Ext"))
      }
      else {
        ret = DisplayKey.get("Toggle.Wizard.NewCheckWizard.NonUS_Ext")
      }

    }
    if (ret != null){

      throw new gw.api.util.DisplayableException(ret)
    }
  }

  /**
   * If Levy Withholding = Yes for any one vendor associated to the check and user clicks on Next on Step 1, trigger a warning message.
   * @param Check
   */
  public static function CheckLevyWithholding(check : Check){
    var levyWithholding : boolean = false
    levyWithholding = check.Payees.hasMatch(\chkpayee -> (chkpayee.ClaimContact.Contact typeis  PersonVendor or chkpayee.ClaimContact.Contact typeis CompanyVendor )
                      and chkpayee.ClaimContact.Contact.Levy_Ext)
    if (levyWithholding){
      pcf.CheckLevyWarn_ExtWorksheet.goInWorkspace()
     }
  }
}