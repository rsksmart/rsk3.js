import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import Account from './account';

export default class Wallet {
    /**
     * @param {Utils} utils
     * @param {Accounts} accountsModule
     *
     * @constructor
     */
    constructor(utils, accountsModule) {
        this.utils = utils;
        this.accountsModule = accountsModule;
        this.defaultKeyName = 'rsk3js_wallet';
        this.accounts = {};
        this.accountsIndex = 0;

        return new Proxy(this, {
            get: (target, name) => {
                if (target.accounts[name]) {
                    return target.accounts[name];
                }

                if (name === 'length') {
                    return target.accountsIndex;
                }

                return target[name];
            }
        });
    }

    /**
     * Creates new accounts with a given entropy
     *
     * @method create
     *
     * @param {Number} numberOfAccounts
     * @param {String} entropy
     *
     * @returns {Wallet}
     */
    create(numberOfAccounts, entropy) {
        for (let i = 0; i < numberOfAccounts; ++i) {
            this.add(Account.from(entropy || this.utils.randomHex(32), this.accountsModule));
        }

        return this;
    }

    /**
     * Returns the account by the given index or address.
     *
     * @method get
     *
     * @param {Number|String} account
     *
     * @returns {Account}
     */
    get(account) {
        return this.accounts[account];
    }

    /**
     * Adds a account to the wallet
     *
     * @method add
     *
     * @param {Account|String} account
     *
     * @returns {Account}
     */
    add(account) {
        if (isString(account)) {
            account = Account.fromPrivateKey(account, this.accountsModule);
        }

        if (isUndefined(account)) {
            throw new Error('account is undefined');
        }

        if (!this.accounts[account.address]) {
            this.accounts[this.accountsIndex] = account;
            this.accounts[account.address] = account;
            this.accounts[account.address.toLowerCase()] = account;

            this.accountsIndex++;

            return account;
        }

        return this.accounts[account.address];
    }

    /**
     * Removes a account from the number by his address or index
     *
     * @method remove
     *
     * @param {String|Number} addressOrIndex
     *
     * @returns {Boolean}
     */
    remove(addressOrIndex) {
        const account = this.accounts[addressOrIndex];

        if (account) {
            delete this.accounts[account.address];
            delete this.accounts[account.address.toLowerCase()];
            delete this.accounts[account.index];

            return true;
        }

        return false;
    }

    /**
     * Clears the wallet
     *
     * @method clear
     *
     * @returns {Wallet}
     */
    clear() {
        for (let i = 0; i <= this.accountsIndex; i++) {
            this.remove(i);
        }

        this.accountsIndex = 0;

        return this;
    }

    /**
     * Encrypts all accounts
     *
     * @method encrypt
     *
     * @param {String} password
     * @param {Object} options
     *
     * @returns {Account[]}
     */
    encrypt(password, options) {
        const encryptedAccounts = [];

        for (let i = 0; i < this.accountsIndex; i++) {
            encryptedAccounts.push(this.accounts[i].encrypt(password, options));
        }

        return encryptedAccounts;
    }

    /**
     * Decrypts all accounts
     *
     * @method decrypt
     *
     * @param {Wallet} encryptedWallet
     * @param {String} password
     *
     * @returns {Wallet}
     */
    decrypt(encryptedWallet, password) {
        encryptedWallet.forEach((keystore) => {
            const account = Account.fromV3Keystore(keystore, password, false, this.accountsModule);

            if (!account) {
                throw new Error("Couldn't decrypt accounts. Password wrong?");
            }

            this.add(account);
        });

        return this;
    }
}
