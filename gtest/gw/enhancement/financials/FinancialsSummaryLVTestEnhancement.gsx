package gw.enhancement.financials

uses gw.util.DepthFirstTraversal
uses pcftest.FinancialsSummaryLV

enhancement FinancialsSummaryLVTestEnhancement : FinancialsSummaryLV {
  property get EntriesFlattened() : List<FinancialsSummaryLV.entry> {
    //how to access the children entries of an entry
    var childrenAccessorBlock : block(FinancialsSummaryLV.entry) :List<FinancialsSummaryLV.entry> =
        \ entry : pcftest.FinancialsSummaryLV.entry -> entry._Entries


    var flattenedEntries : List<FinancialsSummaryLV.entry> = {}

    //process the entry block- what to do when visiting each entry- just accumlate it into a list
    var processNode : block(FinancialsSummaryLV.entry) = \ entry : pcftest.FinancialsSummaryLV.entry -> flattenedEntries.add(entry)

    new DepthFirstTraversal<FinancialsSummaryLV.entry>(this._Entries, childrenAccessorBlock, processNode)
        .traverse()
    return flattenedEntries
  }
}
