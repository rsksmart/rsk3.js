web3.eth.net
============

Functions to receive details about the current connected network.

-----

``` {.javascript}
web3.eth.net.getId([callback])
web3.shh.net.getId([callback])
```

Gets the current network ID.

### Parameters

none

### Returns

`Promise` returns `Number`: The network ID.

### Example

``` {.javascript}
web3.eth.net.getId().then(console.log);
> 1
```

------------------------------------------------------------------------

isListening
-----------

``` {.javascript}
web3.eth.net.isListening([callback])
web3.shh.net.isListening([callback])
```

Checks if the node is listening for peers.

### Parameters

none

### Returns

`Promise` returns `Boolean`

### Example

``` {.javascript}
web3.eth.net.isListening().then(console.log);
> true
```

------------------------------------------------------------------------

getPeerCount
------------

``` {.javascript}
web3.eth.net.getPeerCount([callback])
web3.shh.net.getPeerCount([callback])
```

Get the number of peers connected to.

### Parameters

none

### Returns

`Promise` returns `Number`

### Example

``` {.javascript}
web3.eth.net.getPeerCount().then(console.log);
> 25
```

------------------------------------------------------------------------

getNetworkType
--------------

``` {.javascript}
web3.eth.net.getNetworkType([callback])
```

Guesses the chain the node is connected by comparing the genesis hashes.

It\'s recommended to use the
`web3.eth.getChainId <eth-chainId>`method
to detect the currently connected chain.

### Returns

`Promise` returns `String`:

:   -   `"main"` for main network
    -   `"morden"` for the morden test network
    -   `"rinkeby"` for the rinkeby test network
    -   `"ropsten"` for the ropsten test network
    -   `"kovan"` for the kovan test network
    -   `"private"` for undetectable networks.

### Example

``` {.javascript}
web3.eth.net.getNetworkType().then(console.log);
> "main"
```
