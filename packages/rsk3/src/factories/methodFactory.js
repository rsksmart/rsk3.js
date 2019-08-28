import {
    AbstractMethodFactory,
    CallMethod,
    ChainIdMethod,
    EstimateGasMethod,
    GetBalanceMethod,
    GetBlockNumberMethod,
    GetCodeMethod,
    GetCoinbaseMethod,
    GetGasPriceMethod,
    GetHashrateMethod,
    GetNodeInfoMethod,
    GetPastLogsMethod,
    GetProtocolVersionMethod,
    GetStorageAtMethod,
    GetTransactionCountMethod,
    GetTransactionMethod,
    GetPendingTransactionsMethod,
    GetTransactionReceiptMethod,
    GetWorkMethod,
    IsMiningMethod,
    IsSyncingMethod,
    RequestAccountsMethod,
    SubmitWorkMethod,
    VersionMethod,
    SendRawTransactionMethod,
    EthSendTransactionMethod,
    GetProofMethod
} from 'web3-core-method';

import GetBlockMethod from '../methods/getBlockMethod';
import GetUncleMethod from '../methods/getUncleMethod';
import GetBlockTransactionCountMethod from '../methods/getBlockTransactionCountMethod';
import GetBlockUncleCountMethod from '../methods/getBlockUncleCountMethod';
import GetTransactionFromBlockMethod from '../methods/getTransactionFromBlockMethod';
import EthSignTransactionMethod from '../methods/ethSignTransactionMethod';
import EthSignMethod from '../methods/ethSignMethod';
import EthGetAccountsMethod from '../methods/ethGetAccountsMethod';

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
            getNodeInfo: GetNodeInfoMethod,
            getProtocolVersion: GetProtocolVersionMethod,
            getCoinbase: GetCoinbaseMethod,
            isMining: IsMiningMethod,
            getHashrate: GetHashrateMethod,
            isSyncing: IsSyncingMethod,
            getGasPrice: GetGasPriceMethod,
            getAccounts: EthGetAccountsMethod,
            getBlockNumber: GetBlockNumberMethod,
            getBalance: GetBalanceMethod,
            getStorageAt: GetStorageAtMethod,
            getCode: GetCodeMethod,
            getBlock: GetBlockMethod,
            getUncle: GetUncleMethod,
            getBlockTransactionCount: GetBlockTransactionCountMethod,
            getBlockUncleCount: GetBlockUncleCountMethod,
            getTransaction: GetTransactionMethod,
            getPendingTransactions: GetPendingTransactionsMethod,
            getTransactionFromBlock: GetTransactionFromBlockMethod,
            getTransactionReceipt: GetTransactionReceiptMethod,
            getTransactionCount: GetTransactionCountMethod,
            sendSignedTransaction: SendRawTransactionMethod,
            signTransaction: EthSignTransactionMethod,
            sendTransaction: EthSendTransactionMethod,
            sign: EthSignMethod,
            call: CallMethod,
            estimateGas: EstimateGasMethod,
            submitWork: SubmitWorkMethod,
            getWork: GetWorkMethod,
            getPastLogs: GetPastLogsMethod,
            requestAccounts: RequestAccountsMethod,
            getId: VersionMethod,
            getChainId: ChainIdMethod,
            getProof: GetProofMethod
        };
    }
}
