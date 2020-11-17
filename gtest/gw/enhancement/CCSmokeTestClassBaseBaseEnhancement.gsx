package gw.enhancement

uses gw.api.test.CCSmokeTestClassBase
uses gw.testharness.v3.PLAssertions
uses org.fest.assertions.*

uses java.math.BigDecimal

enhancement CCSmokeTestClassBaseBaseEnhancement : CCSmokeTestClassBase {


  protected function assertThat(actual : Boolean) : BooleanAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : boolean) : BooleanAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : char) : CharAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Double) : DoubleAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Collection<Object>) : CollectionAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : double) : DoubleAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Float) : FloatAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : float) : FloatAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Integer) : IntAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : int) : IntAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : long) : LongAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : BigDecimal) : BigDecimalAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : String) : StringAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Object) : ObjectAssert {
    return PLAssertions.assertThat(actual)
  }

  protected function assertThat(actual : Object[]) : ObjectArrayAssert {
    return PLAssertions.assertThat(actual)
  }

}
