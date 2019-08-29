import {
    LogSubscription,
    NewHeadsSubscription,
    NewPendingTransactionsSubscription,
    SyncingSubscription
} from 'web3-core-subscriptions';

import {GetPastLogsMethod} from 'web3-core-method';

export default class SubscriptionsFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        this.utils = utils;
        this.formatters = formatters;
    }

    /**
     * Gets the correct subscription class by the given name.
     *
     * @method getSubscription
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {String} type
     * @param {Object} options
     *
     * @returns {AbstractSubscription}
     */
    getSubscription(moduleInstance, type, options) {
        switch (type) {
            case 'logs':
                return new LogSubscription(
                    options,
                    this.utils,
                    this.formatters,
                    moduleInstance,
                    new GetPastLogsMethod(this.utils, this.formatters, moduleInstance)
                );
            case 'newBlockHeaders':
                return new NewHeadsSubscription(this.utils, this.formatters, moduleInstance);
            case 'pendingTransactions':
                return new NewPendingTransactionsSubscription(this.utils, this.formatters, moduleInstance);
            case 'syncing':
                return new SyncingSubscription(this.utils, this.formatters, moduleInstance);
            default:
                throw new Error(`Unknown subscription: ${type}`);
        }
    }
}
