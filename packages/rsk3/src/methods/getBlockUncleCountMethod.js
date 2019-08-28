import {AbstractGetBlockUncleCountMethod} from 'web3-core-method';

export default class GetBlockUncleCountMethod extends AbstractGetBlockUncleCountMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('eth_getUncleCountByBlockNumber', utils, formatters, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance
     */
    beforeExecution(moduleInstance) {
        if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getUncleCountByBlockHash';
        }

        super.beforeExecution(moduleInstance);
    }
}
