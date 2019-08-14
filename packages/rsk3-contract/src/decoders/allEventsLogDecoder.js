import EventLogDecoder from './eventLogDecoder';

export default class allEventsLogDecoder extends EventLogDecoder {
    /**
     * @param {AbiCoder} abiCoder
     *
     * @constructor
     */
    constructor(abiCoder) {
        super(abiCoder);
    }

    /**
     * Decodes the event subscription response
     *
     * @method decode
     *
     * @param {AbiModel} abiModel
     * @param {Object} response
     *
     * @returns {Object}
     */
    decode(abiModel, response) {
        const abiItemModel = abiModel.getEventBySignature(response.topics[0]);

        if (abiItemModel) {
            return super.decode(abiItemModel, response);
        }

        return {
            raw: {
                data: response.data,
                topics: response.topics
            }
        };
    }
}
