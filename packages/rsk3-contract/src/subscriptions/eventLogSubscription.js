import {LogSubscription} from 'web3-core-subscriptions';

export default class EventLogSubscription extends LogSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractContract} contract
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {EventLogDecoder} eventLogDecoder
     * @param {AbiItemModel} abiItemModel
     *
     * @constructor
     */
    constructor(options, utils, formatters, contract, getPastLogsMethod, eventLogDecoder, abiItemModel) {
        super(options, utils, formatters, contract, getPastLogsMethod);

        this.eventLogDecoder = eventLogDecoder;
        this.abiItemModel = abiItemModel;
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
            log = this.eventLogDecoder.decode(this.abiItemModel, log);

            this.emit('changed', log);

            return log;
        }

        return this.eventLogDecoder.decode(this.abiItemModel, log);
    }
}
