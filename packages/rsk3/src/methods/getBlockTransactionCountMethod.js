import {AbstractGetBlockTransactionCountMethod} from 'web3-core-method';

export default class GetBlockTransactionCountMethod extends AbstractGetBlockTransactionCountMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('eth_getBlockTransactionCountByNumber', utils, formatters, moduleInstance);
    }

    /**
     * TODO: Refactor public API and create two methods out of it: eth.getBlockTransactionCountByHash(...)
     *
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance
     */
    beforeExecution(moduleInstance) {
        if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getBlockTransactionCountByHash';
        }

        super.beforeExecution(moduleInstance);
    }
}
