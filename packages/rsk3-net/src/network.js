import {AbstractWeb3Module} from 'web3-core';
import isFunction from 'lodash/isFunction';

export default class Network extends AbstractWeb3Module {
    /**
     * @param {Web3EthereumProvider|HttpProvider|WebsocketProvider|IpcProvider|String} provider
     * @param {MethodFactory} methodFactory
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {Object} options
     * @param {Net.Socket} nodeNet
     *
     * @constructor
     */
    constructor(provider, methodFactory, utils, formatters, options, nodeNet) {
        super(provider, options, methodFactory, nodeNet);

        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Determines to which network web3 is currently connected
     *
     * @method getNetworkType
     *
     * @param {Function} callback
     *
     * @callback callback(error, result)
     * @returns {Promise<String|Error>}
     */
    async getNetworkType(callback) {
        try {
            const id = await this.getId();
            let networkType = 'private';

            switch (id) {
                case 30:
                    networkType = 'main';
                    break;
                case 31:
                    networkType = 'testnet';
                    break;
                case 33:
                    networkType = 'regtest';
                    break;
            }

            if (isFunction(callback)) {
                callback(null, networkType);
            }

            return networkType;
        } catch (error) {
            if (isFunction(callback)) {
                callback(error, null);
            }

            throw error;
        }
    }
}
