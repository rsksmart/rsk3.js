import { formatters } from 'web3-core-helpers';
import * as Utils from 'rsk3-utils';
import { AbstractMethodFactory, VersionMethod, GetBlockByNumberMethod, ListeningMethod, PeerCountMethod } from 'web3-core-method';
import { AbstractWeb3Module } from 'web3-core';
import isFunction from 'lodash/isFunction';

class MethodFactory extends AbstractMethodFactory {
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

class Network extends AbstractWeb3Module {
  constructor(provider, methodFactory, utils, formatters, options, nodeNet) {
    super(provider, options, methodFactory, nodeNet);
    this.utils = utils;
    this.formatters = formatters;
  }
  async getNetworkType(callback) {
    try {
      const id = await this.getId();
      let networkType = 'private';
      switch (id) {
        case 30:
          networkType = 'main';
          break;
        case 31:
          networkType = 'testnet';
          break;
        case 33:
          networkType = 'regtest';
          break;
      }
      if (isFunction(callback)) {
        callback(null, networkType);
      }
      return networkType;
    } catch (error) {
      if (isFunction(callback)) {
        callback(error, null);
      }
      throw error;
    }
  }
}

function Network$1(provider, net = null, options = {}) {
  return new Network(provider, new MethodFactory(Utils, formatters), Utils, formatters, options, null);
}

export { Network$1 as Network };
