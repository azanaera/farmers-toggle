package gw.rest.testsupport.v1.plugin.policy

/**
 *  Interface backing adding policies functionality,
 *  to be used in test Policy search adapters.
 */
@Export
interface PolicyStorePlugin {
  function addPolicy(policy : Policy)
}