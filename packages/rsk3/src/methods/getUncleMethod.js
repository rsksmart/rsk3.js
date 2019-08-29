import {AbstractGetUncleMethod} from 'web3-core-method';

export default class GetUncleMethod extends AbstractGetUncleMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super('eth_getUncleByBlockNumberAndIndex', utils, formatters, moduleInstance);
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
            this.rpcMethod = 'eth_getUncleByBlockHashAndIndex';
        }

        super.beforeExecution(moduleInstance);
    }
}
