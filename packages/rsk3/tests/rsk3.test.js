import * as Utils from 'rsk3-utils';
import {formatters} from 'web3-core-helpers';
import {AbstractSubscription, LogSubscription} from 'web3-core-subscriptions';
import {AbiCoder} from 'rsk3-abi';
import {Accounts} from 'rsk3-account';
import {Personal} from 'rsk3-personal';
import {Network} from 'rsk3-net';
import {ContractModuleFactory} from 'rsk3-contract';
import MethodFactory from '../src/factories/methodFactory';
import TransactionSigner from '../src/signers/transactionSigner';
import SubscriptionsFactory from '../src/factories/subscriptionsFactory';
import Rsk3 from '../src/rsk3';

// Mocks
jest.mock('web3-core');
jest.mock('web3-core-subscriptions');
jest.mock('rsk3-abi');
jest.mock('rsk3-account');
jest.mock('rsk3-personal');
jest.mock('rsk3-net');
jest.mock('rsk3-contract');
jest.mock('rsk3-utils');
jest.mock('web3-core-helpers');
jest.mock('../src/factories/methodFactory');
jest.mock('../src/signers/transactionSigner');
jest.mock('../src/factories/subscriptionsFactory');

/**
 * rsk3 test
 */
describe('rsk3Test', () => {
    let rsk3,
        providerMock,
        methodFactoryMock,
        contractModuleFactoryMock,
        networkMock,
        accountsMock,
        personalMock,
        abiCoderMock,
        subscriptionsFactoryMock,
        transactionSignerMock;

    beforeEach(() => {
        providerMock = {send: jest.fn(), clearSubscriptions: jest.fn()};

        new MethodFactory();
        methodFactoryMock = MethodFactory.mock.instances[0];

        new ContractModuleFactory();
        contractModuleFactoryMock = ContractModuleFactory.mock.instances[0];

        new Network();
        networkMock = Network.mock.instances[0];

        new Accounts();
        accountsMock = Accounts.mock.instances[0];

        new Personal();
        personalMock = Personal.mock.instances[0];

        new AbiCoder();
        abiCoderMock = AbiCoder.mock.instances[0];

        new SubscriptionsFactory();
        subscriptionsFactoryMock = SubscriptionsFactory.mock.instances[0];

        new TransactionSigner();
        transactionSignerMock = TransactionSigner.mock.instances[0];

        rsk3 = new Rsk3(
            providerMock,
            methodFactoryMock,
            networkMock,
            accountsMock,
            personalMock,
            abiCoderMock,
            Utils,
            formatters,
            subscriptionsFactoryMock,
            contractModuleFactoryMock,
            {transactionSigner: transactionSignerMock},
            {}
        );
    });

    it('constructor check', () => {
        expect(rsk3.contractModuleFactory).toEqual(contractModuleFactoryMock);

        expect(rsk3.net).toEqual(networkMock);

        expect(rsk3.accounts).toEqual(accountsMock);

        expect(rsk3.personal).toEqual(personalMock);

        expect(rsk3.abi).toEqual(abiCoderMock);

        expect(rsk3.utils).toEqual(Utils);

        expect(rsk3.formatters).toEqual(formatters);

        expect(rsk3.initiatedContracts).toEqual([]);

        expect(rsk3.Contract).toBeInstanceOf(Function);
    });

    it('sets the defaultGasPrice property', () => {
        rsk3.initiatedContracts = [{defaultGasPrice: 20}];

        rsk3.defaultGasPrice = 10;

        expect(rsk3.initiatedContracts[0].defaultGasPrice).toEqual(10);

        expect(rsk3.defaultGasPrice).toEqual(10);

        expect(networkMock.defaultGasPrice).toEqual(10);

        expect(personalMock.defaultGasPrice).toEqual(10);
    });

    it('sets the defaultGas property', () => {
        rsk3.initiatedContracts = [{defaultGas: 20}];
        rsk3.defaultGas = 10;

        expect(rsk3.initiatedContracts[0].defaultGas).toEqual(10);

        expect(rsk3.defaultGas).toEqual(10);

        expect(networkMock.defaultGas).toEqual(10);

        expect(personalMock.defaultGas).toEqual(10);
    });

    it('sets the transactionBlockTimeout property', () => {
        rsk3.initiatedContracts = [{transactionBlockTimeout: 20}];
        rsk3.transactionBlockTimeout = 10;

        expect(rsk3.initiatedContracts[0].transactionBlockTimeout).toEqual(10);

        expect(rsk3.transactionBlockTimeout).toEqual(10);

        expect(networkMock.transactionBlockTimeout).toEqual(10);

        expect(personalMock.transactionBlockTimeout).toEqual(10);
    });

    it('sets the transactionConfirmationBlocks property', () => {
        rsk3.initiatedContracts = [{transactionConfirmationBlocks: 20}];
        rsk3.transactionConfirmationBlocks = 10;

        expect(rsk3.initiatedContracts[0].transactionConfirmationBlocks).toEqual(10);

        expect(rsk3.transactionConfirmationBlocks).toEqual(10);

        expect(networkMock.transactionConfirmationBlocks).toEqual(10);

        expect(personalMock.transactionConfirmationBlocks).toEqual(10);
    });

    it('sets the transactionPollingTimeout property', () => {
        rsk3.initiatedContracts = [{transactionPollingTimeout: 20}];
        rsk3.transactionPollingTimeout = 10;

        expect(rsk3.initiatedContracts[0].transactionPollingTimeout).toEqual(10);

        expect(rsk3.transactionPollingTimeout).toEqual(10);

        expect(networkMock.transactionPollingTimeout).toEqual(10);

        expect(personalMock.transactionPollingTimeout).toEqual(10);
    });

    it('sets the defaultAccount property', () => {
        rsk3.initiatedContracts = [{defaultAccount: '0x0'}];

        Utils.toChecksumAddress.mockReturnValueOnce('0x1');

        rsk3.defaultAccount = '0x1';

        expect(rsk3.initiatedContracts[0].defaultAccount).toEqual('0x1');

        expect(rsk3.defaultAccount).toEqual('0x1');

        expect(networkMock.defaultAccount).toEqual('0x1');

        expect(personalMock.defaultAccount).toEqual('0x1');

        expect(Utils.toChecksumAddress).toHaveBeenCalledWith('0x1');
    });

    it('sets the defaultBlock property', () => {
        rsk3.initiatedContracts = [{defaultBlock: 20}];
        rsk3.defaultBlock = 10;

        expect(rsk3.initiatedContracts[0].defaultBlock).toEqual(10);

        expect(rsk3.defaultBlock).toEqual(10);

        expect(networkMock.defaultBlock).toEqual(10);

        expect(personalMock.defaultBlock).toEqual(10);
    });

    it('calls subscribe wih "logs" as type', () => {
        subscriptionsFactoryMock.createLogSubscription = jest.fn();

        new LogSubscription();
        const logSubscriptionMock = LogSubscription.mock.instances[0];

        logSubscriptionMock.subscribe.mockReturnValueOnce(logSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(logSubscriptionMock);

        const callback = () => {};

        expect(rsk3.subscribe('logs', {}, callback)).toBeInstanceOf(LogSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(rsk3, 'logs', {});

        expect(logSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "newBlockHeaders" as type', () => {
        subscriptionsFactoryMock.createNewHeadsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(rsk3.subscribe('newBlockHeaders', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(rsk3, 'newBlockHeaders', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "pendingTransactions" as type', () => {
        subscriptionsFactoryMock.createNewPendingTransactionsSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(rsk3.subscribe('pendingTransactions', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(rsk3, 'pendingTransactions', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls subscribe wih "syncing" as type', () => {
        subscriptionsFactoryMock.createSyncingSubscription = jest.fn();

        new AbstractSubscription();
        const abstractSubscriptionMock = AbstractSubscription.mock.instances[0];

        abstractSubscriptionMock.subscribe.mockReturnValueOnce(abstractSubscriptionMock);

        subscriptionsFactoryMock.getSubscription.mockReturnValueOnce(abstractSubscriptionMock);

        const callback = () => {};

        expect(rsk3.subscribe('syncing', {}, callback)).toBeInstanceOf(AbstractSubscription);

        expect(subscriptionsFactoryMock.getSubscription).toHaveBeenCalledWith(rsk3, 'syncing', {});

        expect(abstractSubscriptionMock.subscribe).toHaveBeenCalledWith(callback);
    });

    it('calls the Contract factory method with options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        rsk3.currentProvider = providerMock;
        expect(new rsk3.Contract([], '0x0', {data: '', from: '0x0', gas: '0x0', gasPrice: '0x0'})).toEqual({});

        expect(rsk3.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, rsk3.accounts, [], '0x0', {
            defaultAccount: '0x0',
            defaultBlock: rsk3.defaultBlock,
            defaultGas: '0x0',
            defaultGasPrice: '0x0',
            transactionBlockTimeout: rsk3.transactionBlockTimeout,
            transactionConfirmationBlocks: rsk3.transactionConfirmationBlocks,
            transactionPollingTimeout: rsk3.transactionPollingTimeout,
            transactionSigner: rsk3.transactionSigner,
            data: ''
        });
    });

    it('calls the Contract factory method without options from the constructor', () => {
        contractModuleFactoryMock.createContract.mockReturnValueOnce({});

        rsk3.currentProvider = providerMock;
        expect(new rsk3.Contract([], '0x0', {})).toEqual({});

        expect(rsk3.initiatedContracts).toHaveLength(1);

        expect(contractModuleFactoryMock.createContract).toHaveBeenCalledWith(providerMock, rsk3.accounts, [], '0x0', {
            defaultAccount: rsk3.defaultAccount,
            defaultBlock: rsk3.defaultBlock,
            defaultGas: rsk3.defaultGas,
            defaultGasPrice: rsk3.defaultGasPrice,
            transactionBlockTimeout: rsk3.transactionBlockTimeout,
            transactionConfirmationBlocks: rsk3.transactionConfirmationBlocks,
            transactionPollingTimeout: rsk3.transactionPollingTimeout,
            transactionSigner: rsk3.transactionSigner,
            data: undefined
        });
    });
});
