import { AbstractWeb3Module } from 'web3-core';
import { ProvidersModuleFactory, ProviderDetector } from 'web3-providers';
import { formatters } from 'web3-core-helpers';
import { Accounts } from 'rsk3-account';
import { ContractModuleFactory } from 'rsk3-contract';
import { Personal } from 'rsk3-personal';
import { AbiCoder } from 'rsk3-abi';
import { Network } from 'rsk3-net';
import * as Utils from 'rsk3-utils';
import EthereumTx from 'ethereumjs-tx';
import { AbstractGetBlockMethod, AbstractGetUncleMethod, AbstractGetBlockTransactionCountMethod, AbstractGetBlockUncleCountMethod, AbstractGetTransactionFromBlockMethod, SignTransactionMethod, SignMethod, GetAccountsMethod, AbstractMethodFactory, GetNodeInfoMethod, GetProtocolVersionMethod, GetCoinbaseMethod, IsMiningMethod, GetHashrateMethod, IsSyncingMethod, GetGasPriceMethod, GetBlockNumberMethod, GetBalanceMethod, GetStorageAtMethod, GetCodeMethod, GetTransactionMethod, GetPendingTransactionsMethod, GetTransactionReceiptMethod, GetTransactionCountMethod, SendRawTransactionMethod, EthSendTransactionMethod, CallMethod, EstimateGasMethod, SubmitWorkMethod, GetWorkMethod, GetPastLogsMethod, RequestAccountsMethod, VersionMethod, ChainIdMethod, GetProofMethod } from 'web3-core-method';
import isString from 'lodash/isString';
import { LogSubscription, NewHeadsSubscription, NewPendingTransactionsSubscription, SyncingSubscription } from 'web3-core-subscriptions';

class TransactionSigner {
  constructor(utils, formatters) {
    this.utils = utils;
    this.formatters = formatters;
  }
  get type() {
    return 'TransactionSigner';
  }
  async sign(transaction, privateKey) {
    if (!privateKey) {
      throw new Error('No privateKey given to the TransactionSigner.');
    }
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.substring(2);
    }
    const ethTx = new EthereumTx(transaction);
    ethTx.sign(Buffer.from(privateKey, 'hex'));
    const validationResult = ethTx.validate(true);
    if (validationResult !== '') {
      throw new Error(`TransactionSigner Error: ${validationResult}`);
    }
    const rlpEncoded = ethTx.serialize().toString('hex');
    const rawTransaction = '0x' + rlpEncoded;
    const transactionHash = this.utils.keccak256(rawTransaction);
    return {
      messageHash: Buffer.from(ethTx.hash(false)).toString('hex'),
      v: '0x' + Buffer.from(ethTx.v).toString('hex'),
      r: '0x' + Buffer.from(ethTx.r).toString('hex'),
      s: '0x' + Buffer.from(ethTx.s).toString('hex'),
      rawTransaction,
      transactionHash
    };
  }
}

class GetBlockMethod extends AbstractGetBlockMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getBlockByNumber', utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    if (this.isHash(this.parameters[0])) {
      this.rpcMethod = 'eth_getBlockByHash';
    }
    super.beforeExecution(moduleInstance);
  }
}

class GetUncleMethod extends AbstractGetUncleMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getUncleByBlockNumberAndIndex', utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    if (this.isHash(this.parameters[0])) {
      this.rpcMethod = 'eth_getUncleByBlockHashAndIndex';
    }
    super.beforeExecution(moduleInstance);
  }
}

class GetBlockTransactionCountMethod extends AbstractGetBlockTransactionCountMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getBlockTransactionCountByNumber', utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    if (this.isHash(this.parameters[0])) {
      this.rpcMethod = 'eth_getBlockTransactionCountByHash';
    }
    super.beforeExecution(moduleInstance);
  }
}

class GetBlockUncleCountMethod extends AbstractGetBlockUncleCountMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getUncleCountByBlockNumber', utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    if (this.isHash(this.parameters[0])) {
      this.rpcMethod = 'eth_getUncleCountByBlockHash';
    }
    super.beforeExecution(moduleInstance);
  }
}

class GetTransactionFromBlockMethod extends AbstractGetTransactionFromBlockMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getTransactionByBlockNumberAndIndex', utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    if (this.isHash(this.parameters[0])) {
      this.rpcMethod = 'eth_getTransactionByBlockHashAndIndex';
    }
    super.beforeExecution(moduleInstance);
  }
}

class RskSignTransactionMethod extends SignTransactionMethod {
  constructor(utils, formatters, moduleInstance) {
    super(utils, formatters, moduleInstance);
  }
  beforeExecution(moduleInstance) {
    this.parameters[0] = this.formatters.inputTransactionFormatter(this.parameters[0], moduleInstance);
  }
  execute() {
    if (isString(this.parameters[1])) {
      const account = this.moduleInstance.accounts.wallet[this.parameters[1]];
      if (account) {
        return this.moduleInstance.transactionSigner.sign(this.parameters[0], account.privateKey);
      }
    }
    return super.execute();
  }
}

class RskSignMethod extends SignMethod {
  constructor(utils, formatters, moduleInstance) {
    super(utils, formatters, moduleInstance);
  }
  execute() {
    if (this.moduleInstance.accounts.wallet[this.parameters[1]]) {
      return this.signLocally();
    }
    return super.execute();
  }
  async signLocally() {
    try {
      this.beforeExecution(this.moduleInstance);
      const signedMessage = this.moduleInstance.accounts.sign(this.parameters[1], this.moduleInstance.accounts.wallet[this.parameters[0]].privateKey);
      if (this.callback) {
        this.callback(false, signedMessage);
        return;
      }
      return signedMessage;
    } catch (error) {
      if (this.callback) {
        this.callback(error, null);
        return;
      }
      throw error;
    }
  }
}

class RskGetAccountsMethod extends GetAccountsMethod {
  constructor(utils, formatters, moduleInstance) {
    super(utils, formatters, moduleInstance);
  }
  execute() {
    if (this.moduleInstance.accounts.wallet.accountsIndex) {
      const accounts = [];
      for (let i = 0; i < this.moduleInstance.accounts.wallet.accountsIndex; i++) {
        accounts.push(this.moduleInstance.accounts.wallet[i].address);
      }
      return Promise.resolve(accounts);
    }
    return super.execute();
  }
}

class MethodFactory extends AbstractMethodFactory {
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
      getAccounts: RskGetAccountsMethod,
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
      signTransaction: RskSignTransactionMethod,
      sendTransaction: EthSendTransactionMethod,
      sign: RskSignMethod,
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

class SubscriptionsFactory {
  constructor(utils, formatters) {
    this.utils = utils;
    this.formatters = formatters;
  }
  getSubscription(moduleInstance, type, options) {
    switch (type) {
      case 'logs':
        return new LogSubscription(options, this.utils, this.formatters, moduleInstance, new GetPastLogsMethod(this.utils, this.formatters, moduleInstance));
      case 'newBlockHeaders':
        return new NewHeadsSubscription(this.utils, this.formatters, moduleInstance);
      case 'pendingTransactions':
        return new NewPendingTransactionsSubscription(this.utils, this.formatters, moduleInstance);
      case 'syncing':
        return new SyncingSubscription(this.utils, this.formatters, moduleInstance);
      default:
        throw new Error(`Unknown subscription: ${type}`);
    }
  }
}

class Rsk3 extends AbstractWeb3Module {
  constructor(provider, net, options = {}) {
    super(provider, options, new MethodFactory(Utils, formatters), net);
    if (!options.transactionSigner || options.transactionSigner.type === 'TransactionSigner') {
      options.transactionSigner = new TransactionSigner(Utils, formatters);
    }
    const providerResolver = new ProvidersModuleFactory().createProviderResolver();
    const resolvedProvider = providerResolver.resolve(provider, net);
    this.net = new Network(resolvedProvider, null, options);
    this.accounts = new Accounts(resolvedProvider, null, options);
    this.personal = new Personal(resolvedProvider, null, this.accounts, options);
    this.abiCoder = new AbiCoder();
    this.formatters = formatters;
    this.subscriptionsFactory = new SubscriptionsFactory(Utils, formatters);
    this.contractModuleFactory = new ContractModuleFactory(Utils, formatters, this.abiCoder, this.accounts);
    this.initiatedContracts = [];
    this._transactionSigner = options.transactionSigner;
    this.Contract = (abi, address, options = {}) => {
      const contract = this.contractModuleFactory.createContract(this.currentProvider, this.accounts, abi, address, {
        defaultAccount: options.from || options.defaultAccount || this.defaultAccount,
        defaultBlock: options.defaultBlock || this.defaultBlock,
        defaultGas: options.gas || options.defaultGas || this.defaultGas,
        defaultGasPrice: options.gasPrice || options.defaultGasPrice || this.defaultGasPrice,
        transactionBlockTimeout: options.transactionBlockTimeout || this.transactionBlockTimeout,
        transactionConfirmationBlocks: options.transactionConfirmationBlocks || this.transactionConfirmationBlocks,
        transactionPollingTimeout: options.transactionPollingTimeout || this.transactionPollingTimeout,
        transactionSigner: this.transactionSigner,
        data: options.data
      });
      this.initiatedContracts.push(contract);
      return contract;
    };
  }
  get transactionSigner() {
    return this._transactionSigner;
  }
  set transactionSigner(transactionSigner) {
    if (transactionSigner.type && transactionSigner.type === 'TransactionSigner') {
      throw new Error('Invalid TransactionSigner given!');
    }
    this._transactionSigner = transactionSigner;
    this.accounts.transactionSigner = transactionSigner;
    this.ens.transactionSigner = transactionSigner;
    this.initiatedContracts.forEach(contract => {
      contract.transactionSigner = transactionSigner;
    });
  }
  clearSubscriptions() {
    return super.clearSubscriptions('eth_unsubscribe');
  }
  set defaultGasPrice(value) {
    this.initiatedContracts.forEach(contract => {
      contract.defaultGasPrice = value;
    });
    this.net.defaultGasPrice = value;
    this.personal.defaultGasPrice = value;
    super.defaultGasPrice = value;
  }
  get defaultGasPrice() {
    return super.defaultGasPrice;
  }
  set defaultGas(value) {
    this.initiatedContracts.forEach(contract => {
      contract.defaultGas = value;
    });
    this.net.defaultGas = value;
    this.personal.defaultGas = value;
    super.defaultGas = value;
  }
  get defaultGas() {
    return super.defaultGas;
  }
  set transactionBlockTimeout(value) {
    this.initiatedContracts.forEach(contract => {
      contract.transactionBlockTimeout = value;
    });
    this.net.transactionBlockTimeout = value;
    this.personal.transactionBlockTimeout = value;
    super.transactionBlockTimeout = value;
  }
  get transactionBlockTimeout() {
    return super.transactionBlockTimeout;
  }
  set transactionConfirmationBlocks(value) {
    this.initiatedContracts.forEach(contract => {
      contract.transactionConfirmationBlocks = value;
    });
    this.net.transactionConfirmationBlocks = value;
    this.personal.transactionConfirmationBlocks = value;
    super.transactionConfirmationBlocks = value;
  }
  get transactionConfirmationBlocks() {
    return super.transactionConfirmationBlocks;
  }
  set transactionPollingTimeout(value) {
    this.initiatedContracts.forEach(contract => {
      contract.transactionPollingTimeout = value;
    });
    this.net.transactionPollingTimeout = value;
    this.personal.transactionPollingTimeout = value;
    super.transactionPollingTimeout = value;
  }
  get transactionPollingTimeout() {
    return super.transactionPollingTimeout;
  }
  set defaultAccount(value) {
    this.initiatedContracts.forEach(contract => {
      contract.defaultAccount = Rsk3.utils.toChecksumAddress(value);
    });
    this.net.defaultAccount = value;
    this.personal.defaultAccount = value;
    super.defaultAccount = value;
  }
  get defaultAccount() {
    return super.defaultAccount;
  }
  set defaultBlock(value) {
    this.initiatedContracts.forEach(contract => {
      contract.defaultBlock = value;
    });
    this.net.defaultBlock = value;
    this.personal.defaultBlock = value;
    super.defaultBlock = value;
  }
  get defaultBlock() {
    return super.defaultBlock;
  }
  subscribe(type, options, callback) {
    return this.subscriptionsFactory.getSubscription(this, type, options).subscribe(callback);
  }
  setProvider(provider, net) {
    const setContractProviders = this.initiatedContracts.every(contract => {
      return contract.setProvider(provider, net);
    });
    return this.net.setProvider(provider, net) && this.personal.setProvider(provider, net) && this.ens.setProvider(provider, net) && super.setProvider(provider, net) && setContractProviders;
  }
  static get givenProvider() {
    return ProviderDetector.detect();
  }
  static get utils() {
    return Utils;
  }
  static get Net() {
    const providerResolver = new ProvidersModuleFactory().createProviderResolver();
    return (provider, options, net) => {
      return new Network(providerResolver.resolve(provider, net), options);
    };
  }
  static get Personal() {
    const providerResolver = new ProvidersModuleFactory().createProviderResolver();
    return (provider, options, net) => {
      return new Personal(providerResolver.resolve(provider, net), options);
    };
  }
}

export default Rsk3;
