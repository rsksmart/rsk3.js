(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('@babel/runtime/helpers/possibleConstructorReturn'), require('@babel/runtime/helpers/set'), require('@babel/runtime/helpers/getPrototypeOf'), require('@babel/runtime/helpers/get'), require('@babel/runtime/helpers/inherits'), require('web3-core'), require('web3-providers'), require('web3-core-helpers'), require('rsk3-account'), require('rsk3-contract'), require('rsk3-personal'), require('rsk3-abi'), require('rsk3-net'), require('rsk3-utils'), require('@babel/runtime/regenerator'), require('@babel/runtime/helpers/asyncToGenerator'), require('ethereumjs-tx'), require('web3-core-method'), require('lodash/isString'), require('web3-core-subscriptions')) :
    typeof define === 'function' && define.amd ? define(['@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', '@babel/runtime/helpers/possibleConstructorReturn', '@babel/runtime/helpers/set', '@babel/runtime/helpers/getPrototypeOf', '@babel/runtime/helpers/get', '@babel/runtime/helpers/inherits', 'web3-core', 'web3-providers', 'web3-core-helpers', 'rsk3-account', 'rsk3-contract', 'rsk3-personal', 'rsk3-abi', 'rsk3-net', 'rsk3-utils', '@babel/runtime/regenerator', '@babel/runtime/helpers/asyncToGenerator', 'ethereumjs-tx', 'web3-core-method', 'lodash/isString', 'web3-core-subscriptions'], factory) :
    (global = global || self, global.Rsk3 = factory(global._classCallCheck, global._createClass, global._possibleConstructorReturn, global._set, global._getPrototypeOf, global._get, global._inherits, global.web3Core, global.web3Providers, global['web3-core-helpers'], global['rsk3-account'], global['rsk3-contract'], global['rsk3-personal'], global['rsk3-abi'], global['rsk3-net'], global.Utils, global._regeneratorRuntime, global._asyncToGenerator, global.EthereumTx, global.web3CoreMethod, global.isString, global.web3CoreSubscriptions));
}(this, function (_classCallCheck, _createClass, _possibleConstructorReturn, _set, _getPrototypeOf, _get, _inherits, web3Core, web3Providers, web3CoreHelpers, rsk3Account, rsk3Contract, rsk3Personal, rsk3Abi, rsk3Net, Utils, _regeneratorRuntime, _asyncToGenerator, EthereumTx, web3CoreMethod, isString, web3CoreSubscriptions) { 'use strict';

    _classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
    _createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
    _possibleConstructorReturn = _possibleConstructorReturn && _possibleConstructorReturn.hasOwnProperty('default') ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
    _set = _set && _set.hasOwnProperty('default') ? _set['default'] : _set;
    _getPrototypeOf = _getPrototypeOf && _getPrototypeOf.hasOwnProperty('default') ? _getPrototypeOf['default'] : _getPrototypeOf;
    _get = _get && _get.hasOwnProperty('default') ? _get['default'] : _get;
    _inherits = _inherits && _inherits.hasOwnProperty('default') ? _inherits['default'] : _inherits;
    _regeneratorRuntime = _regeneratorRuntime && _regeneratorRuntime.hasOwnProperty('default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;
    _asyncToGenerator = _asyncToGenerator && _asyncToGenerator.hasOwnProperty('default') ? _asyncToGenerator['default'] : _asyncToGenerator;
    EthereumTx = EthereumTx && EthereumTx.hasOwnProperty('default') ? EthereumTx['default'] : EthereumTx;
    isString = isString && isString.hasOwnProperty('default') ? isString['default'] : isString;

    var TransactionSigner =
    function () {
      function TransactionSigner(utils, formatters) {
        _classCallCheck(this, TransactionSigner);
        this.utils = utils;
        this.formatters = formatters;
      }
      _createClass(TransactionSigner, [{
        key: "sign",
        value: function () {
          var _sign = _asyncToGenerator(
          _regeneratorRuntime.mark(function _callee(transaction, privateKey) {
            var ethTx, validationResult, rlpEncoded, rawTransaction, transactionHash;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (privateKey) {
                      _context.next = 2;
                      break;
                    }
                    throw new Error('No privateKey given to the TransactionSigner.');
                  case 2:
                    if (privateKey.startsWith('0x')) {
                      privateKey = privateKey.substring(2);
                    }
                    ethTx = new EthereumTx(transaction);
                    ethTx.sign(Buffer.from(privateKey, 'hex'));
                    validationResult = ethTx.validate(true);
                    if (!(validationResult !== '')) {
                      _context.next = 8;
                      break;
                    }
                    throw new Error("TransactionSigner Error: ".concat(validationResult));
                  case 8:
                    rlpEncoded = ethTx.serialize().toString('hex');
                    rawTransaction = '0x' + rlpEncoded;
                    transactionHash = this.utils.keccak256(rawTransaction);
                    return _context.abrupt("return", {
                      messageHash: Buffer.from(ethTx.hash(false)).toString('hex'),
                      v: '0x' + Buffer.from(ethTx.v).toString('hex'),
                      r: '0x' + Buffer.from(ethTx.r).toString('hex'),
                      s: '0x' + Buffer.from(ethTx.s).toString('hex'),
                      rawTransaction: rawTransaction,
                      transactionHash: transactionHash
                    });
                  case 12:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));
          function sign(_x, _x2) {
            return _sign.apply(this, arguments);
          }
          return sign;
        }()
      }, {
        key: "type",
        get: function get() {
          return 'TransactionSigner';
        }
      }]);
      return TransactionSigner;
    }();

    var GetBlockMethod =
    function (_AbstractGetBlockMeth) {
      _inherits(GetBlockMethod, _AbstractGetBlockMeth);
      function GetBlockMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, GetBlockMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(GetBlockMethod).call(this, 'eth_getBlockByNumber', utils, formatters, moduleInstance));
      }
      _createClass(GetBlockMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getBlockByHash';
          }
          _get(_getPrototypeOf(GetBlockMethod.prototype), "beforeExecution", this).call(this, moduleInstance);
        }
      }]);
      return GetBlockMethod;
    }(web3CoreMethod.AbstractGetBlockMethod);

    var GetUncleMethod =
    function (_AbstractGetUncleMeth) {
      _inherits(GetUncleMethod, _AbstractGetUncleMeth);
      function GetUncleMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, GetUncleMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(GetUncleMethod).call(this, 'eth_getUncleByBlockNumberAndIndex', utils, formatters, moduleInstance));
      }
      _createClass(GetUncleMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getUncleByBlockHashAndIndex';
          }
          _get(_getPrototypeOf(GetUncleMethod.prototype), "beforeExecution", this).call(this, moduleInstance);
        }
      }]);
      return GetUncleMethod;
    }(web3CoreMethod.AbstractGetUncleMethod);

    var GetBlockTransactionCountMethod =
    function (_AbstractGetBlockTran) {
      _inherits(GetBlockTransactionCountMethod, _AbstractGetBlockTran);
      function GetBlockTransactionCountMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, GetBlockTransactionCountMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(GetBlockTransactionCountMethod).call(this, 'eth_getBlockTransactionCountByNumber', utils, formatters, moduleInstance));
      }
      _createClass(GetBlockTransactionCountMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getBlockTransactionCountByHash';
          }
          _get(_getPrototypeOf(GetBlockTransactionCountMethod.prototype), "beforeExecution", this).call(this, moduleInstance);
        }
      }]);
      return GetBlockTransactionCountMethod;
    }(web3CoreMethod.AbstractGetBlockTransactionCountMethod);

    var GetBlockUncleCountMethod =
    function (_AbstractGetBlockUncl) {
      _inherits(GetBlockUncleCountMethod, _AbstractGetBlockUncl);
      function GetBlockUncleCountMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, GetBlockUncleCountMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(GetBlockUncleCountMethod).call(this, 'eth_getUncleCountByBlockNumber', utils, formatters, moduleInstance));
      }
      _createClass(GetBlockUncleCountMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getUncleCountByBlockHash';
          }
          _get(_getPrototypeOf(GetBlockUncleCountMethod.prototype), "beforeExecution", this).call(this, moduleInstance);
        }
      }]);
      return GetBlockUncleCountMethod;
    }(web3CoreMethod.AbstractGetBlockUncleCountMethod);

    var GetTransactionFromBlockMethod =
    function (_AbstractGetTransacti) {
      _inherits(GetTransactionFromBlockMethod, _AbstractGetTransacti);
      function GetTransactionFromBlockMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, GetTransactionFromBlockMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(GetTransactionFromBlockMethod).call(this, 'eth_getTransactionByBlockNumberAndIndex', utils, formatters, moduleInstance));
      }
      _createClass(GetTransactionFromBlockMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          if (this.isHash(this.parameters[0])) {
            this.rpcMethod = 'eth_getTransactionByBlockHashAndIndex';
          }
          _get(_getPrototypeOf(GetTransactionFromBlockMethod.prototype), "beforeExecution", this).call(this, moduleInstance);
        }
      }]);
      return GetTransactionFromBlockMethod;
    }(web3CoreMethod.AbstractGetTransactionFromBlockMethod);

    var RskSignTransactionMethod =
    function (_SignTransactionMetho) {
      _inherits(RskSignTransactionMethod, _SignTransactionMetho);
      function RskSignTransactionMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, RskSignTransactionMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(RskSignTransactionMethod).call(this, utils, formatters, moduleInstance));
      }
      _createClass(RskSignTransactionMethod, [{
        key: "beforeExecution",
        value: function beforeExecution(moduleInstance) {
          this.parameters[0] = this.formatters.inputTransactionFormatter(this.parameters[0], moduleInstance);
        }
      }, {
        key: "execute",
        value: function execute() {
          if (isString(this.parameters[1])) {
            var account = this.moduleInstance.accounts.wallet[this.parameters[1]];
            if (account) {
              return this.moduleInstance.transactionSigner.sign(this.parameters[0], account.privateKey);
            }
          }
          return _get(_getPrototypeOf(RskSignTransactionMethod.prototype), "execute", this).call(this);
        }
      }]);
      return RskSignTransactionMethod;
    }(web3CoreMethod.SignTransactionMethod);

    var RskSignMethod =
    function (_SignMethod) {
      _inherits(RskSignMethod, _SignMethod);
      function RskSignMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, RskSignMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(RskSignMethod).call(this, utils, formatters, moduleInstance));
      }
      _createClass(RskSignMethod, [{
        key: "execute",
        value: function execute() {
          if (this.moduleInstance.accounts.wallet[this.parameters[1]]) {
            return this.signLocally();
          }
          return _get(_getPrototypeOf(RskSignMethod.prototype), "execute", this).call(this);
        }
      }, {
        key: "signLocally",
        value: function () {
          var _signLocally = _asyncToGenerator(
          _regeneratorRuntime.mark(function _callee() {
            var signedMessage;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    this.beforeExecution(this.moduleInstance);
                    signedMessage = this.moduleInstance.accounts.sign(this.parameters[1], this.moduleInstance.accounts.wallet[this.parameters[0]].privateKey);
                    if (!this.callback) {
                      _context.next = 6;
                      break;
                    }
                    this.callback(false, signedMessage);
                    return _context.abrupt("return");
                  case 6:
                    return _context.abrupt("return", signedMessage);
                  case 9:
                    _context.prev = 9;
                    _context.t0 = _context["catch"](0);
                    if (!this.callback) {
                      _context.next = 14;
                      break;
                    }
                    this.callback(_context.t0, null);
                    return _context.abrupt("return");
                  case 14:
                    throw _context.t0;
                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[0, 9]]);
          }));
          function signLocally() {
            return _signLocally.apply(this, arguments);
          }
          return signLocally;
        }()
      }]);
      return RskSignMethod;
    }(web3CoreMethod.SignMethod);

    var RskGetAccountsMethod =
    function (_GetAccountsMethod) {
      _inherits(RskGetAccountsMethod, _GetAccountsMethod);
      function RskGetAccountsMethod(utils, formatters, moduleInstance) {
        _classCallCheck(this, RskGetAccountsMethod);
        return _possibleConstructorReturn(this, _getPrototypeOf(RskGetAccountsMethod).call(this, utils, formatters, moduleInstance));
      }
      _createClass(RskGetAccountsMethod, [{
        key: "execute",
        value: function execute() {
          if (this.moduleInstance.accounts.wallet.accountsIndex) {
            var accounts = [];
            for (var i = 0; i < this.moduleInstance.accounts.wallet.accountsIndex; i++) {
              accounts.push(this.moduleInstance.accounts.wallet[i].address);
            }
            return Promise.resolve(accounts);
          }
          return _get(_getPrototypeOf(RskGetAccountsMethod.prototype), "execute", this).call(this);
        }
      }]);
      return RskGetAccountsMethod;
    }(web3CoreMethod.GetAccountsMethod);

    var MethodFactory =
    function (_AbstractMethodFactor) {
      _inherits(MethodFactory, _AbstractMethodFactor);
      function MethodFactory(utils, formatters) {
        var _this;
        _classCallCheck(this, MethodFactory);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(MethodFactory).call(this, utils, formatters));
        _this.methods = {
          getNodeInfo: web3CoreMethod.GetNodeInfoMethod,
          getProtocolVersion: web3CoreMethod.GetProtocolVersionMethod,
          getCoinbase: web3CoreMethod.GetCoinbaseMethod,
          isMining: web3CoreMethod.IsMiningMethod,
          getHashrate: web3CoreMethod.GetHashrateMethod,
          isSyncing: web3CoreMethod.IsSyncingMethod,
          getGasPrice: web3CoreMethod.GetGasPriceMethod,
          getAccounts: RskGetAccountsMethod,
          getBlockNumber: web3CoreMethod.GetBlockNumberMethod,
          getBalance: web3CoreMethod.GetBalanceMethod,
          getStorageAt: web3CoreMethod.GetStorageAtMethod,
          getCode: web3CoreMethod.GetCodeMethod,
          getBlock: GetBlockMethod,
          getUncle: GetUncleMethod,
          getBlockTransactionCount: GetBlockTransactionCountMethod,
          getBlockUncleCount: GetBlockUncleCountMethod,
          getTransaction: web3CoreMethod.GetTransactionMethod,
          getPendingTransactions: web3CoreMethod.GetPendingTransactionsMethod,
          getTransactionFromBlock: GetTransactionFromBlockMethod,
          getTransactionReceipt: web3CoreMethod.GetTransactionReceiptMethod,
          getTransactionCount: web3CoreMethod.GetTransactionCountMethod,
          sendSignedTransaction: web3CoreMethod.SendRawTransactionMethod,
          signTransaction: RskSignTransactionMethod,
          sendTransaction: web3CoreMethod.EthSendTransactionMethod,
          sign: RskSignMethod,
          call: web3CoreMethod.CallMethod,
          estimateGas: web3CoreMethod.EstimateGasMethod,
          submitWork: web3CoreMethod.SubmitWorkMethod,
          getWork: web3CoreMethod.GetWorkMethod,
          getPastLogs: web3CoreMethod.GetPastLogsMethod,
          requestAccounts: web3CoreMethod.RequestAccountsMethod,
          getId: web3CoreMethod.VersionMethod,
          getChainId: web3CoreMethod.ChainIdMethod,
          getProof: web3CoreMethod.GetProofMethod
        };
        return _this;
      }
      return MethodFactory;
    }(web3CoreMethod.AbstractMethodFactory);

    var SubscriptionsFactory =
    function () {
      function SubscriptionsFactory(utils, formatters) {
        _classCallCheck(this, SubscriptionsFactory);
        this.utils = utils;
        this.formatters = formatters;
      }
      _createClass(SubscriptionsFactory, [{
        key: "getSubscription",
        value: function getSubscription(moduleInstance, type, options) {
          switch (type) {
            case 'logs':
              return new web3CoreSubscriptions.LogSubscription(options, this.utils, this.formatters, moduleInstance, new web3CoreMethod.GetPastLogsMethod(this.utils, this.formatters, moduleInstance));
            case 'newBlockHeaders':
              return new web3CoreSubscriptions.NewHeadsSubscription(this.utils, this.formatters, moduleInstance);
            case 'pendingTransactions':
              return new web3CoreSubscriptions.NewPendingTransactionsSubscription(this.utils, this.formatters, moduleInstance);
            case 'syncing':
              return new web3CoreSubscriptions.SyncingSubscription(this.utils, this.formatters, moduleInstance);
            default:
              throw new Error("Unknown subscription: ".concat(type));
          }
        }
      }]);
      return SubscriptionsFactory;
    }();

    var Rsk3 =
    function (_AbstractWeb3Module) {
      _inherits(Rsk3, _AbstractWeb3Module);
      function Rsk3(provider, net) {
        var _this;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        _classCallCheck(this, Rsk3);
        _this = _possibleConstructorReturn(this, _getPrototypeOf(Rsk3).call(this, provider, options, new MethodFactory(Utils, web3CoreHelpers.formatters), net));
        if (!options.transactionSigner || options.transactionSigner.type === 'TransactionSigner') {
          options.transactionSigner = new TransactionSigner(Utils, web3CoreHelpers.formatters);
        }
        var providerResolver = new web3Providers.ProvidersModuleFactory().createProviderResolver();
        var resolvedProvider = providerResolver.resolve(provider, net);
        _this.net = new rsk3Net.Network(resolvedProvider, null, options);
        _this.accounts = new rsk3Account.Accounts(resolvedProvider, null, options);
        _this.personal = new rsk3Personal.Personal(resolvedProvider, null, _this.accounts, options);
        _this.abiCoder = new rsk3Abi.AbiCoder();
        _this.formatters = web3CoreHelpers.formatters;
        _this.subscriptionsFactory = new SubscriptionsFactory(Utils, web3CoreHelpers.formatters);
        _this.contractModuleFactory = new rsk3Contract.ContractModuleFactory(Utils, web3CoreHelpers.formatters, _this.abiCoder, _this.accounts);
        _this.initiatedContracts = [];
        _this._transactionSigner = options.transactionSigner;
        _this.Contract = function (abi, address) {
          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var contract = _this.contractModuleFactory.createContract(_this.currentProvider, _this.accounts, abi, address, {
            defaultAccount: options.from || options.defaultAccount || _this.defaultAccount,
            defaultBlock: options.defaultBlock || _this.defaultBlock,
            defaultGas: options.gas || options.defaultGas || _this.defaultGas,
            defaultGasPrice: options.gasPrice || options.defaultGasPrice || _this.defaultGasPrice,
            transactionBlockTimeout: options.transactionBlockTimeout || _this.transactionBlockTimeout,
            transactionConfirmationBlocks: options.transactionConfirmationBlocks || _this.transactionConfirmationBlocks,
            transactionPollingTimeout: options.transactionPollingTimeout || _this.transactionPollingTimeout,
            transactionSigner: _this.transactionSigner,
            data: options.data
          });
          _this.initiatedContracts.push(contract);
          return contract;
        };
        return _this;
      }
      _createClass(Rsk3, [{
        key: "clearSubscriptions",
        value: function clearSubscriptions() {
          return _get(_getPrototypeOf(Rsk3.prototype), "clearSubscriptions", this).call(this, 'eth_unsubscribe');
        }
      }, {
        key: "subscribe",
        value: function subscribe(type, options, callback) {
          return this.subscriptionsFactory.getSubscription(this, type, options).subscribe(callback);
        }
      }, {
        key: "setProvider",
        value: function setProvider(provider, net) {
          var setContractProviders = this.initiatedContracts.every(function (contract) {
            return contract.setProvider(provider, net);
          });
          return this.net.setProvider(provider, net) && this.personal.setProvider(provider, net) && this.ens.setProvider(provider, net) && _get(_getPrototypeOf(Rsk3.prototype), "setProvider", this).call(this, provider, net) && setContractProviders;
        }
      }, {
        key: "transactionSigner",
        get: function get() {
          return this._transactionSigner;
        }
        ,
        set: function set(transactionSigner) {
          if (transactionSigner.type && transactionSigner.type === 'TransactionSigner') {
            throw new Error('Invalid TransactionSigner given!');
          }
          this._transactionSigner = transactionSigner;
          this.accounts.transactionSigner = transactionSigner;
          this.ens.transactionSigner = transactionSigner;
          this.initiatedContracts.forEach(function (contract) {
            contract.transactionSigner = transactionSigner;
          });
        }
      }, {
        key: "defaultGasPrice",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.defaultGasPrice = value;
          });
          this.net.defaultGasPrice = value;
          this.personal.defaultGasPrice = value;
          _set(_getPrototypeOf(Rsk3.prototype), "defaultGasPrice", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "defaultGasPrice", this);
        }
      }, {
        key: "defaultGas",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.defaultGas = value;
          });
          this.net.defaultGas = value;
          this.personal.defaultGas = value;
          _set(_getPrototypeOf(Rsk3.prototype), "defaultGas", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "defaultGas", this);
        }
      }, {
        key: "transactionBlockTimeout",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.transactionBlockTimeout = value;
          });
          this.net.transactionBlockTimeout = value;
          this.personal.transactionBlockTimeout = value;
          _set(_getPrototypeOf(Rsk3.prototype), "transactionBlockTimeout", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "transactionBlockTimeout", this);
        }
      }, {
        key: "transactionConfirmationBlocks",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.transactionConfirmationBlocks = value;
          });
          this.net.transactionConfirmationBlocks = value;
          this.personal.transactionConfirmationBlocks = value;
          _set(_getPrototypeOf(Rsk3.prototype), "transactionConfirmationBlocks", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "transactionConfirmationBlocks", this);
        }
      }, {
        key: "transactionPollingTimeout",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.transactionPollingTimeout = value;
          });
          this.net.transactionPollingTimeout = value;
          this.personal.transactionPollingTimeout = value;
          _set(_getPrototypeOf(Rsk3.prototype), "transactionPollingTimeout", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "transactionPollingTimeout", this);
        }
      }, {
        key: "defaultAccount",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.defaultAccount = Rsk3.utils.toChecksumAddress(value);
          });
          this.net.defaultAccount = value;
          this.personal.defaultAccount = value;
          _set(_getPrototypeOf(Rsk3.prototype), "defaultAccount", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "defaultAccount", this);
        }
      }, {
        key: "defaultBlock",
        set: function set(value) {
          this.initiatedContracts.forEach(function (contract) {
            contract.defaultBlock = value;
          });
          this.net.defaultBlock = value;
          this.personal.defaultBlock = value;
          _set(_getPrototypeOf(Rsk3.prototype), "defaultBlock", value, this, true);
        }
        ,
        get: function get() {
          return _get(_getPrototypeOf(Rsk3.prototype), "defaultBlock", this);
        }
      }], [{
        key: "givenProvider",
        get: function get() {
          return web3Providers.ProviderDetector.detect();
        }
      }, {
        key: "utils",
        get: function get() {
          return Utils;
        }
      }, {
        key: "Net",
        get: function get() {
          var providerResolver = new web3Providers.ProvidersModuleFactory().createProviderResolver();
          return function (provider, options, net) {
            return new rsk3Net.Network(providerResolver.resolve(provider, net), options);
          };
        }
      }, {
        key: "Personal",
        get: function get() {
          var providerResolver = new web3Providers.ProvidersModuleFactory().createProviderResolver();
          return function (provider, options, net) {
            return new rsk3Personal.Personal(providerResolver.resolve(provider, net), options);
          };
        }
      }]);
      return Rsk3;
    }(web3Core.AbstractWeb3Module);

    return Rsk3;

}));
