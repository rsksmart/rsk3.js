import {GetPastLogsMethod} from 'web3-core-method';
import EventLogSubscription from '../subscriptions/eventLogSubscription';
import AllEventsLogSubscription from '../subscriptions/allEventsLogSubscription';

export default class EventSubscriptionFactory {
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
     * Returns an event log subscription
     *
     * @param {EventLogDecoder} eventLogDecoder
     * @param {AbstractContract} contract
     * @param {Object} options
     * @param {AbiItemModel} abiItemModel
     *
     * @returns {EventLogSubscription}
     */
    createEventLogSubscription(eventLogDecoder, contract, options, abiItemModel) {
        return new EventLogSubscription(
            options,
            this.utils,
            this.formatters,
            contract,
            new GetPastLogsMethod(this.utils, this.formatters, contract),
            eventLogDecoder,
            abiItemModel
        );
    }

    /**
     * Returns an log subscription for all events
     *
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {AllEventsLogSubscription}
     */
    createAllEventsLogSubscription(allEventsLogDecoder, contract, options) {
        return new AllEventsLogSubscription(
            options,
            this.utils,
            this.formatters,
            contract,
            new GetPastLogsMethod(this.utils, this.formatters, contract),
            allEventsLogDecoder,
            contract.abiModel
        );
    }
}
