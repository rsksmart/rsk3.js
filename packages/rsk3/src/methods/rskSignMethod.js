import {SignMethod} from 'web3-core-method';

export default class RskSignMethod extends SignMethod {
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
        if (this.moduleInstance.accounts.wallet[this.parameters[1]]) {
            return this.signLocally();
        }

        return super.execute();
    }

    /**
     * Signs the message on the client.
     *
     * @method signLocally
     *
     * @returns {Promise<String>}
     */
    async signLocally() {
        try {
            this.beforeExecution(this.moduleInstance);

            const signedMessage = this.moduleInstance.accounts.sign(
                this.parameters[1],
                this.moduleInstance.accounts.wallet[this.parameters[0]].privateKey
            );

            if (this.callback) {
                this.callback(false, signedMessage);

                return;
            }

            return signedMessage;
        } catch (error) {
            if (this.callback) {
                this.callback(error, null);

                return;
            }

            throw error;
        }
    }
}
