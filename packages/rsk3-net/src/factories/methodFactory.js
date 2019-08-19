import {
    AbstractMethodFactory,
    GetBlockByNumberMethod,
    ListeningMethod,
    PeerCountMethod,
    VersionMethod
} from 'web3-core-method';

export default class MethodFactory extends AbstractMethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super(utils, formatters);

        this.methods = {
            getId: VersionMethod,
            getBlockByNumber: GetBlockByNumberMethod,
            isListening: ListeningMethod,
            getPeerCount: PeerCountMethod
        };
    }
}
