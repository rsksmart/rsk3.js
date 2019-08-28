import isString from 'lodash/isString';
import {SignTransactionMethod} from 'web3-core-method';

export default class EthSignTransactionMethod extends SignTransactionMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance) {
        super(utils, formatters, moduleInstance);
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance
     */
    beforeExecution(moduleInstance) {
        this.parameters[0] = this.formatters.inputTransactionFormatter(this.parameters[0], moduleInstance);
    }

    /**
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object|String>}
     */
    execute() {
        if (isString(this.parameters[1])) {
            const account = this.moduleInstance.accounts.wallet[this.parameters[1]];
            if (account) {
                return this.moduleInstance.transactionSigner.sign(this.parameters[0], account.privateKey);
            }
        }

        return super.execute();
    }
}
