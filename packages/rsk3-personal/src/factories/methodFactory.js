import {
    AbstractMethodFactory,
    GetAccountsMethod,
    NewAccountMethod,
    UnlockAccountMethod,
    LockAccountMethod,
    ImportRawKeyMethod,
    PersonalSendTransactionMethod,
    PersonalSignTransactionMethod,
    PersonalSignMethod,
    EcRecoverMethod
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
            getAccounts: GetAccountsMethod,
            newAccount: NewAccountMethod,
            unlockAccount: UnlockAccountMethod,
            lockAccount: LockAccountMethod,
            importRawKey: ImportRawKeyMethod,
            sendTransaction: PersonalSendTransactionMethod,
            signTransaction: PersonalSignTransactionMethod,
            sign: PersonalSignMethod,
            ecRecover: EcRecoverMethod
        };
    }
}
