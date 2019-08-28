import {GetAccountsMethod} from 'web3-core-method';

export default class EthGetAccountsMethod extends GetAccountsMethod {
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
     * Sends a JSON-RPC call request
     *
     * @method execute
     *
     * @callback callback callback(error, result)
     * @returns {Promise<Object|String>}
     */
    execute() {
        if (this.moduleInstance.accounts.wallet.accountsIndex) {
            const accounts = [];
            for (let i = 0; i < this.moduleInstance.accounts.wallet.accountsIndex; i++) {
                accounts.push(this.moduleInstance.accounts.wallet[i].address);
            }

            return Promise.resolve(accounts);
        }

        return super.execute();
    }
}
