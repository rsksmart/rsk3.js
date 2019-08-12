import {ChainIdMethod, GetGasPriceMethod, GetTransactionCountMethod, AbstractMethodFactory} from 'web3-core-method';

export default class MethodFactory extends AbstractMethodFactory {
    /**
     * @param utils
     * @param formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super(utils, formatters);

        this.methods = {
            getChainId: ChainIdMethod,
            getGasPrice: GetGasPriceMethod,
            getTransactionCount: GetTransactionCountMethod
        };
    }
}
