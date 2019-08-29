import {AbstractGetTransactionFromBlockMethod} from 'web3-core-method';

export default class GetTransactionFromBlockMethod extends AbstractGetTransactionFromBlockMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('eth_getTransactionByBlockNumberAndIndex', utils, formatters, moduleInstance);
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
            this.rpcMethod = 'eth_getTransactionByBlockHashAndIndex';
        }

        super.beforeExecution(moduleInstance);
    }
}
