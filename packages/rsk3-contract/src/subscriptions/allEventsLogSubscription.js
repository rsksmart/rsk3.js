import {LogSubscription} from 'web3-core-subscriptions';

export default class AllEventsLogSubscription extends LogSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractContract} contract
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {EventLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     *
     * @constructor
     */
    constructor(options, utils, formatters, contract, getPastLogsMethod, allEventsLogDecoder, abiModel) {
        super(options, utils, formatters, contract, getPastLogsMethod);

        this.allEventsLogDecoder = allEventsLogDecoder;
        this.abiModel = abiModel;
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {*} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        let log = this.formatters.outputLogFormatter(subscriptionItem);

        if (log.removed) {
            log = this.allEventsLogDecoder.decode(this.abiModel, log);

            this.emit('changed', log);

            return log;
        }

        return this.allEventsLogDecoder.decode(this.abiModel, log);
    }
}
