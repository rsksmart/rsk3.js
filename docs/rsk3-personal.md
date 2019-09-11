
web3.eth.personal
=================

The `web3-eth-personal` package allows you to interact with the Ethereum
node\'s accounts.

::: {.note}
::: {.admonition-title}
Note
:::

Many of these functions send sensitive information, like password. Never
call these functions over a unsecured Websocket or HTTP provider, as
your password will be sent in plain text!
:::

``` {.javascript}
import Web3 from 'web3';
import {Personal} from 'web3-eth-personal';

// "Web3.givenProvider" will be set if in an Ethereum supported browser.
const personal = new Personal(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


// or using the web3 umbrella package
const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);

// -> web3.eth.personal
```

------------------------------------------------------------------------

options
-------

An Web3 module does provide several options for configuring the
transaction confirmation worklfow or for defining default values. These
are the currently available option properties on a Web3 module:

### Module Options {#web3-module-options}

`defaultAccount <web3-module-defaultaccount>`{.interpreted-text
role="ref"}

`defaultBlock <web3-module-defaultblock>`{.interpreted-text role="ref"}

`defaultGas <web3-module-defaultgas>`{.interpreted-text role="ref"}

`defaultGasPrice <web3-module-defaultaccount>`{.interpreted-text
role="ref"}

`transactionBlockTimeout <web3-module-transactionblocktimeout>`{.interpreted-text
role="ref"}

`transactionConfirmationBlocks <web3-module-transactionconfirmationblocks>`{.interpreted-text
role="ref"}

`transactionPollingTimeout <web3-module-transactionpollingtimeout>`{.interpreted-text
role="ref"}

`transactionSigner <web3-module-transactionSigner>`{.interpreted-text
role="ref"}

### Example

``` {.javascript}
import Web3 from 'web3';

const options = {
    defaultAccount: '0x0',
    defaultBlock: 'latest',
    defaultGas: 1,
    defaultGasPrice: 0,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 24,
    transactionPollingTimeout: 480,
    transactionSigner: new CustomTransactionSigner()
}

const web3 = new Web3('http://localhost:8545', null, options);
```

------------------------------------------------------------------------

defaultBlock {#web3-module-defaultblock}
------------

``` {.javascript}
web3.defaultBlock
web3.eth.defaultBlock
web3.shh.defaultBlock
...
```

The default block is used for all methods which have a block parameter.
You can override it by passing the block parameter if a block is
required.

Example:

-   `web3.eth.getBalance() <eth-getbalance>`{.interpreted-text
    role="ref"}
-   `web3.eth.getCode() <eth-code>`{.interpreted-text role="ref"}
-   `web3.eth.getTransactionCount() <eth-gettransactioncount>`{.interpreted-text
    role="ref"}
-   `web3.eth.getStorageAt() <eth-getstorageat>`{.interpreted-text
    role="ref"}
-   `web3.eth.call() <eth-call>`{.interpreted-text role="ref"}
-   `new web3.eth.Contract() -> myContract.methods.myMethod().call() <contract-call>`{.interpreted-text
    role="ref"}

### Returns

The `defaultBlock` property can return the following values:

-   `Number`: A block number
-   `"genesis"` - `String`: The genesis block
-   `"latest"` - `String`: The latest block (current head of the
    blockchain)
-   `"pending"` - `String`: The currently mined block (including pending
    transactions)

Default is `"latest"`

------------------------------------------------------------------------

defaultAccount {#web3-module-defaultaccount}
--------------

``` {.javascript}
web3.defaultAccount
web3.eth.defaultAccount
web3.shh.defaultAccount
...
```

This default address is used as the default `"from"` property, if no
`"from"` property is specified.

### Returns

`String` - 20 Bytes: Any Ethereum address. You need to have the private
key for that address in your node or keystore. (Default is `undefined`)

------------------------------------------------------------------------

defaultGasPrice {#web3-module-defaultgasprice}
---------------

``` {.javascript}
web3.defaultGasPrice
web3.eth.defaultGasPrice
web3.shh.defaultGasPrice
...
```

The default gas price which will be used for a request.

### Returns

`string|number`: The current value of the defaultGasPrice property.

------------------------------------------------------------------------

defaultGas {#web3-module-defaultgas}
----------

``` {.javascript}
web3.defaultGas
web3.eth.defaultGas
web3.shh.defaultGas
...
```

The default gas which will be used for a request.

### Returns

`string|number`: The current value of the defaultGas property.

------------------------------------------------------------------------

::: {#web3-module-transactionblocktimeout}
transactionBlockTimeout =====================
:::

``` {.javascript}
web3.transactionBlockTimeout
web3.eth.transactionBlockTimeout
web3.shh.transactionBlockTimeout
...
```

The `transactionBlockTimeout` will be used over a socket based
connection. This option does define the amount of new blocks it should
wait until the first confirmation happens. This means the PromiEvent
rejects with a timeout error when the timeout got exceeded.

### Returns

`number`: The current value of transactionBlockTimeout

------------------------------------------------------------------------

::: {#web3-module-transactionconfirmationblocks}
transactionConfirmationBlocks =====================
:::

``` {.javascript}
web3.transactionConfirmationBlocks
web3.eth.transactionConfirmationBlocks
web3.shh.transactionConfirmationBlocks
...
```

This defines the number of blocks it requires until a transaction will
be handled as confirmed.

### Returns

`number`: The current value of transactionConfirmationBlocks

------------------------------------------------------------------------

::: {#web3-module-transactionpollingtimeout}
transactionPollingTimeout =====================
:::

``` {.javascript}
web3.transactionPollingTimeout
web3.eth.transactionPollingTimeout
web3.shh.transactionPollingTimeout
...
```

The `transactionPollingTimeout` will be used over a HTTP connection.
This option does define the amount of polls (each second) it should wait
until the first confirmation happens.

### Returns

`number`: The current value of transactionPollingTimeout

------------------------------------------------------------------------

transactionSigner {#web3-module-transactionSigner}
-----------------

``` {.javascript}
web3.eth.transactionSigner
...
```

The `transactionSigner` property does provide us the possibility to
customize the signing process of the `Eth` module and the related
sub-modules.

The interface of a `TransactionSigner`:

``` {.javascript}
interface TransactionSigner {
    sign(txObject: Transaction): Promise<SignedTransaction>
}

interface SignedTransaction {
    messageHash: string,
    v: string,
    r: string,
    s: string,
    rawTransaction: string
}
```

### Returns

`TransactionSigner`: A JavaScript class of type TransactionSigner.

------------------------------------------------------------------------

setProvider
-----------

``` {.javascript}
web3.setProvider(myProvider)
web3.eth.setProvider(myProvider)
web3.shh.setProvider(myProvider)
...
```

Will change the provider for its module.

::: {.note}
::: {.admonition-title}
Note
:::

When called on the umbrella package `web3` it will also set the provider
for all sub modules `web3.eth`, `web3.shh`, etc.
:::

### Parameters

1.  `Object|String` - `provider`: a valid provider
2.  `Net` - `net`: (optional) the node.js Net package. This is only
    required for the IPC provider.

### Returns

`Boolean`

### Example

``` {.javascript}
import Web3 from 'web3';

const web3 = new Web3('http://localhost:8545');

// or
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
web3.setProvider('ws://localhost:8546');
// or
web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
const net = require('net');
const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path

// or
const web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// on windows the path is: '\\\\.\\pipe\\geth.ipc'
// on linux the path is: '/users/myuser/.ethereum/geth.ipc'
```

------------------------------------------------------------------------

providers
---------

``` {.javascript}
Web3.providers
Eth.providers
...
```

Contains the current available providers.

### Value

`Object` with the following providers:

> -   `Object` - `HttpProvider`: The HTTP provider is **deprecated**, as
>     it won\'t work for subscriptions.
> -   `Object` - `WebsocketProvider`: The Websocket provider is the
>     standard for usage in legacy browsers.
> -   `Object` - `IpcProvider`: The IPC provider is used node.js dapps
>     when running a local node. Gives the most secure connection.

### Example

``` {.javascript}
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
// or
const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// Using the IPC provider in node.js
const net = require('net');

const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// or
const web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// on windows the path is: '\\\\.\\pipe\\geth.ipc'
// on linux the path is: '/users/myuser/.ethereum/geth.ipc'
```

------------------------------------------------------------------------

givenProvider
-------------

``` {.javascript}
Web3.givenProvider
web3.eth.givenProvider
web3.shh.givenProvider
...
```

When using web3.js in an Ethereum compatible browser, it will set with
the current native provider by that browser. Will return the given
provider by the (browser) environment, otherwise `null`.

### Returns

`Object`: The given provider set or `false`.

### Example

``` {.javascript}
web3.setProvider(Web3.givenProvider || 'ws://localhost:8546');
```

------------------------------------------------------------------------

currentProvider
---------------

``` {.javascript}
web3.currentProvider
web3.eth.currentProvider
web3.shh.currentProvider
...
```

Will return the current provider.

### Returns

`Object`: The current provider set.

### Example

``` {.javascript}
if (!web3.currentProvider) {
    web3.setProvider('http://localhost:8545');
}
```

------------------------------------------------------------------------

BatchRequest
------------

``` {.javascript}
new web3.BatchRequest()
new web3.eth.BatchRequest()
new web3.shh.BatchRequest()
...
```

Class to create and execute batch requests.

### Parameters

none

### Returns

`Object`: With the following methods:

> -   `add(request)`: To add a request object to the batch call.
> -   `execute()`: Will execute the batch request.

### Example

``` {.javascript}
const contract = new web3.eth.Contract(abi, address);

const batch = new web3.BatchRequest();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest'));
batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}));
batch.execute().then(...);
```

------------------------------------------------------------------------

::: {#personal-newaccount}
newAccount =========
:::

``` {.javascript}
web3.eth.personal.newAccount(password, [callback])
```

Create a new account on the node that Web3 is connected to with its
provider. The RPC method used is `personal_newAccount`. It differs from
`web3.eth.accounts.create() <accounts-create>`{.interpreted-text
role="ref"} where the key pair is created only on client and it\'s up to
the developer to manage it.

::: {.note}
::: {.admonition-title}
Note
:::

Never call this function over a unsecured Websocket or HTTP provider, as
your password will be send in plain text!
:::

### Parameters

1.  `password` - `String`: The password to encrypt this account with.

### Returns

`Promise<string>` - The address of the newly created account.

### Example

``` {.javascript}
web3.eth.personal.newAccount('!@superpassword')
.then(console.log);
> '0x1234567891011121314151617181920212223456'
```

------------------------------------------------------------------------

sign
----

``` {.javascript}
web3.eth.personal.sign(dataToSign, address, password [, callback])
```

Signs data using a specific account. This data is before UTF-8 HEX
decoded and enveloped as follows:
`"\x19Ethereum Signed Message:\n" + message.length + message`.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `String` - Data to sign. If String it will be converted using
    `web3.utils.utf8ToHex <utils-utf8tohex>`{.interpreted-text
    role="ref"}.
2.  `String` - Address to sign data with.
3.  `String` - The password of the account to sign data with.
4.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<string>` - The signature.

### Example

``` {.javascript}
web3.eth.personal.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

// the below is the same
web3.eth.personal.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
.then(console.log);
> "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```

------------------------------------------------------------------------

ecRecover
---------

``` {.javascript}
web3.eth.personal.ecRecover(dataThatWasSigned, signature [, callback])
```

Recovers the account that signed the data.

### Parameters

1.  `String` - Data that was signed. If String it will be converted
    using `web3.utils.utf8ToHex <utils-utf8tohex>`{.interpreted-text
    role="ref"}.
2.  `String` - The signature.
3.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<string>` - The account.

### Example

``` {.javascript}
web3.eth.personal.ecRecover("Hello world", "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400").then(console.log);
> "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"
```

------------------------------------------------------------------------

signTransaction
---------------

``` {.javascript}
web3.eth.personal.signTransaction(transaction, password [, callback])
```

Signs a transaction. This account needs to be unlocked.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `Object` - The transaction data to sign
    `web3.eth.sendTransaction() <eth-sendtransaction>`{.interpreted-text
    role="ref"} for more.
2.  `String` - The password of the `from` account, to sign the
    transaction with.
3.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<Object>` - The RLP encoded transaction. The `raw` property can
be used to send the transaction using
`web3.eth.sendSignedTransaction <eth-sendsignedtransaction>`{.interpreted-text
role="ref"}.

### Example

``` {.javascript}
web3.eth.signTransaction({
    from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
    gasPrice: "20000000000",
    gas: "21000",
    to: '0x3535353535353535353535353535353535353535',
    value: "1000000000000000000",
    data: ""
}, 'MyPassword!').then(console.log);
> {
    raw: '0xf86c808504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a04f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88da07e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
    tx: {
        nonce: '0x0',
        gasPrice: '0x4a817c800',
        gas: '0x5208',
        to: '0x3535353535353535353535353535353535353535',
        value: '0xde0b6b3a7640000',
        input: '0x',
        v: '0x25',
        r: '0x4f4c17305743700648bc4f6cd3038ec6f6af0df73e31757007b7f59df7bee88d',
        s: '0x7e1941b264348e80c78c4027afc65a87b0a5e43e86742b8ca0823584c6788fd0',
        hash: '0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384'
    }
}
```

------------------------------------------------------------------------

sendTransaction
---------------

``` {.javascript}
web3.eth.personal.sendTransaction(transactionOptions, password [, callback])
```

This method sends a transaction over the management API.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `Object` - The transaction options
2.  `String` - The passphrase for the current account
3.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<string>` - The transaction hash.

### Example

``` {.javascript}
web3.eth.sendTransaction({
    from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
    gasPrice: "20000000000",
    gas: "21000",
    to: '0x3535353535353535353535353535353535353535',
    value: "1000000000000000000",
    data: ""
}, 'MyPassword!').then(console.log);
> '0xda3be87732110de6c1354c83770aae630ede9ac308d9f7b399ecfba23d923384'
```

------------------------------------------------------------------------

unlockAccount
-------------

``` {.javascript}
web3.eth.personal.unlockAccount(address, password, unlockDuraction [, callback])
```

Unlocks the given account.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `address` - `String`: The account address.
2.  `password` - `String` - The password of the account.
3.  `unlockDuration` - `Number` - The duration for the account to remain
    unlocked.
4.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<boolean>` - True if the account got unlocked successful
otherwise false.

### Example

``` {.javascript}
web3.eth.personal.unlockAccount("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!", 600)
.then(console.log('Account unlocked!'));
> "Account unlocked!"
```

------------------------------------------------------------------------

lockAccount
-----------

``` {.javascript}
web3.eth.personal.lockAccount(address [, callback])
```

Locks the given account.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `address` - `String`: The account address.
2.  `Function` - (optional) Optional callback, returns an error object
    as first parameter and the result as second.

### Returns

`Promise<boolean>`

### Example

``` {.javascript}
web3.eth.personal.lockAccount("0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe")
.then(console.log('Account locked!'));
> "Account locked!"
```

------------------------------------------------------------------------

getAccounts {#personal-getaccounts}
-----------

``` {.javascript}
web3.eth.personal.getAccounts([callback])
```

Returns a list of accounts the node controls by using the provider and
calling the RPC method `personal_listAccounts`. Using
`web3.eth.accounts.create() <accounts-create>`{.interpreted-text
role="ref"} will not add accounts into this list. For that use
`web3.eth.personal.newAccount() <personal-newaccount>`{.interpreted-text
role="ref"}.

The results are the same as
`web3.eth.getAccounts() <eth-getaccounts>`{.interpreted-text role="ref"}
except that calls the RPC method `eth_accounts`.

### Returns

`Promise<Array>` - An array of addresses controlled by node.

### Example

``` {.javascript}
web3.eth.personal.getAccounts()
.then(console.log);
> ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
```

------------------------------------------------------------------------

importRawKey
------------

``` {.javascript}
web3.eth.personal.importRawKey(privateKey, password)
```

Imports the given private key into the key store, encrypting it with the
passphrase.

Returns the address of the new account.

::: {.note}
::: {.admonition-title}
Note
:::

Sending your account password over an unsecured HTTP RPC connection is
highly unsecure.
:::

### Parameters

1.  `privateKey` - `String` - An unencrypted private key (hex string).
2.  `password` - `String` - The password of the account.

### Returns

`Promise<string>` - The address of the account.

### Example

``` {.javascript}
web3.eth.personal.importRawKey("cd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295e", "password1234")
.then(console.log);
> "0x8f337bf484b2fc75e4b0436645dcc226ee2ac531"
```

------------------------------------------------------------------------
