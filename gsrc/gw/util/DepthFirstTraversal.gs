package gw.util

@Export
class DepthFirstTraversal<T> {

  var _roots : List<T>
  var _childrenAccessor : block(T):List<T>
  var _visitor : block(T)

  construct(roots : List<T>,
            childrenAccessor : block(T):List<T>,
            visitor : block(T)) {
    _roots = roots
    _childrenAccessor = childrenAccessor
    _visitor = visitor
  }

  function traverse() {
    _roots.each(\elt -> traverse(elt))
  }

  function traverse(n : T) {
    visit(n)
    _childrenAccessor(n).each(\elt -> traverse(elt))
  }

  function visit(n : T) {
    _visitor(n)
  }
}
