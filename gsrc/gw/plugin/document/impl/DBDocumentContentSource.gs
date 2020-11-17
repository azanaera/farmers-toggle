package gw.plugin.document.impl

uses gw.document.DocumentContentsInfo
uses gw.plugin.document.IDocumentContentSource
uses gw.util.StreamUtil

uses java.io.InputStream
uses java.text.SimpleDateFormat

class DBDocumentContentSource implements IDocumentContentSource {

  override property get InboundAvailable() : boolean {
    return true
  }

  override property get OutboundAvailable() : boolean {
    return true
  }

  override function addDocument(content : InputStream, document : Document) : boolean {
    document.Content = content == null ? null : new Blob(StreamUtil.getContent(content))
    document.DateModified = Date.CurrentDate
    document.DocUID = document.Name + new SimpleDateFormat("yyyyMMddHHmmss").format(document.DateCreated?:Date.CurrentDate)
    return false
  }

  override function isDocument(document : Document) : boolean {
    return document.Content != null
  }

  override function getDocumentContentsInfo(document : Document, includeContents : boolean) : DocumentContentsInfo {
    var contentStream = includeContents ? document.Content?.toInputStream() : null
    return new DocumentContentsInfo(DocumentContentsInfo.ContentResponseType.DOCUMENT_CONTENTS, contentStream, document.MimeType)
  }

  override function getDocumentContentsInfoForExternalUse(document : Document) : DocumentContentsInfo {
    return new DocumentContentsInfo(DocumentContentsInfo.ContentResponseType.DOCUMENT_CONTENTS, document.Content?.toInputStream(), document.MimeType)
  }

  override function updateDocument(document : Document, content : InputStream) : boolean {
    document.Content = content == null ? null : new Blob(StreamUtil.getContent(content))
    document.DateModified = Date.CurrentDate
    return false
  }

  override function removeDocument(document : Document) : boolean {
    return true
  }
}