export default class MethodOptionsMapper {
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
     * Sets the default options where it is required
     *
     * @param {AbstractContract} contract
     * @param {Object} options
     *
     * @returns {Object}
     */
    map(contract, options) {
        let from = null;

        if (options.from) {
            from = this.utils.toChecksumAddress(this.formatters.inputAddressFormatter(options.from));
        }

        options.to = contract.address;
        options.from = from || contract.defaultAccount;
        options.gasPrice = options.gasPrice || contract.defaultGasPrice;
        options.gas = options.gas || options.gasLimit || contract.defaultGas;
        delete options.gasLimit;

        return options;
    }
}
