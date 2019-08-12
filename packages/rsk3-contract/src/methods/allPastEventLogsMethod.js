import {GetPastLogsMethod} from 'web3-core-method';

export default class AllPastEventLogsMethod extends GetPastLogsMethod {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AllEventsLogDecoder} allEventsLogDecoder
     * @param {AbiModel} abiModel
     * @param {AllEventsOptionsMapper} allEventsOptionsMapper
     *
     * @constructor
     */
    constructor(utils, formatters, moduleInstance, allEventsLogDecoder, abiModel, allEventsOptionsMapper) {
        super(utils, formatters, moduleInstance);
        this.abiModel = abiModel;
        this.allEventsLogDecoder = allEventsLogDecoder;
        this.allEventsOptionsMapper = allEventsOptionsMapper;
    }

    /**
     * This method will be executed before the RPC request.
     *
     * @method beforeExecution
     *
     * @param {AbstractWeb3Module} moduleInstance - The package where the method is called from for example Eth.
     */
    beforeExecution(moduleInstance) {
        super.beforeExecution(moduleInstance);
        this.parameters[0] = this.allEventsOptionsMapper.map(this.abiModel, moduleInstance, this.parameters[0]);
    }

    /**
     * This method will be executed after the RPC request.
     *
     * @method afterExecution
     *
     * @param {Array} response
     *
     * @returns {Array}
     */
    afterExecution(response) {
        const formattedLogs = super.afterExecution(response);

        return formattedLogs.map((logItem) => {
            return this.allEventsLogDecoder.decode(this.abiModel, logItem);
        });
    }
}
