## Base Layer

The Base Layer enableds wallet(private keys) to be stored in secure enclave and hardware device. It also provides ways to store, protect, access and recovery wallets.

## Wallet API
A Wallet manages a private/public key pair which is used to cryptographically sign transactions and prove ownership on the blockchain.

new Wallet **( privateKey [ , provider ] )**
>Creates a new instance from privateKey and optionally connect a provider


*Wallet* . **createRandom ( )**   =>   Wallet
>Creates a new random wallet. Ensure this wallet is stored somewhere safe, if lost there is NO way to recover it.

*Wallet* . **fromEncryptedJson** ( json, password [ , progressCallback ] )   =>   Wallet
>Decrypt an encrypted Secret Storage JSON Wallet 

*Wallet* . **fromMnemonic ( mnemonic [ , path = “m/44’/60’/0’/0/0” [ , wordlist ] ] )**   =>   Wallet
Generate a BIP-039 + BIP-044 wallet from mnemonic deriving path using the wordlist. The default language is English (en).
| Language  | node.js	  |
|---|---|
| English (US)  | .wordlists.en  |
|  Italian | .wordlists.it	  |
|  Japanese |  .wordlists.ja	 |
|  Korean |  .wordlists.ko	 |



## Signer API
The Signer API is an abstract class which makes it easy to extend and add new signers, that can be used by this library and extension libraries. The Wallet extends the Signer API, as do the Ledger Hardware Wallet Signer.

To implement a Signer, inherit the abstract class Signer and implement the following properties:

*object*. **provider**
>A Provider that is connected to the network. This is optional, however, without a provider, only write-only operations should be expected to work.

*object*. **getAddress ( )**   =>   Promise<Address>
>Returns a Promise that resolves to the account address.

*object*. **signMessage ( message )**   =>   Promise<hex>
>Returns a Promise that resolves to the Flat-Format Signature for the message.
>
>If message is a string, it is converted to UTF-8 bytes, otherwise it is preserved as a binary representation of the Arrayish data.

*object*. **sendTransaction ( transaction )**   =>   Promise<TransactionResponse>
>Sends the transaction (see Transaction Requests) to the network and returns a Promise that resolves to a Transaction Response. Any properties that are not provided will be populated from the network.


## Middle Layer

The Middle Layer provides API Interpreter for all typical actions, including transactions, smart contract operations, sign/verify messages, as well as common utilities. The Middle Layer sends request to base layer for verification and signing.


## Contract Operations

A Contract is an abstraction of an executable program on the RSK Blockchain. A Contract has code (called byte code) as well as allocated long-term memory (called storage). Every deployed Contract has an address, which is used to connect to it so that it may be sent messages to call its methods.

A Contract can emit Events, which can be efficiently observed by applications to be notified when a contract has performed specific operation. Events cannot be read by a Contract.

The Contract API provides simple way to connect to a Contract and call its methods, as functions on a JavaScript object, handling all the binary protocol conversion, internal name mangling and topic construction. This allows a Contract object to be used like any standard JavaScript object, without having to worry about the low-level details of the  Virtual Machine or Blockchain.

The Contract object is a meta-class, which is a class that defines a Class at run-time. The Contract definition (called an Application Binary Interface, or ABI) can be provided and the available methods and events will be dynamically added to the object.



#### Deploying a Contract

To deploy a contract to the RSK network, a **ContractFactory** can be created which manages the Contract bytecode and **Application Binary Interface** (ABI), usually generated from the Solidity compiler.

new . **ContractFactory ( abi , bytecode [ , signer ] )**
>Creates a factory for deployment of the Contract with *bytecode*, and the constructor defined in the *abi*. The signer will be used to send any deployment transaction.


 . **ContractFactory . fromSolidity ( compilerOutput [ , signer ] )**
>Creates a ContractFactory from the *compilerOutput* of the *Solidity* compiler or from the *Truffle* JSON. (i.e. <span style="color:red;">output.contracts['SimpleStorage.sol'].SimpleStorage</span>)

*prototype* . **connect ( signer )**   =>   ContractFactory
>Create a **new instance** of the ContractFactory, connected to the new *signer*.

*prototype* . **bytecode**
>The Contract executable byte code..

*prototype* . **interface**
>The Contract Application Binary Interface (ABI).

*prototype* . **signer**
>The Signer that will be used to send transactions to the network. If this is null, <span style="color:red;">deploy()</span> cannot be called.

*prototype* . **attach ( address )**   =>   Contract
>Connect to an existing instance of this Contract at *address* using the Contract Interface and Signer.

*prototype* . **deploy ( … )**   =>   Promise<Contract>
>Creates a transaction to deploy the transaction and sends it to the network using the contract Signer, returning a Promise that resolves to a Contract. The transaction is available as contract.deployTransaction.
>
>Keep in mind that the Contract may not be mined immediately. The <span style="color:red;">contract.deployed()</span> function will return a Promise which will resolve once the contract is deployed, or reject if there was an error during deployment.

*prototype* . **getDeployTransaction ( … )**   =>   UnsignedTransaction
>Returns the transaction required to deploy the Contract with the provided constructor arguments. This is often useful for signing offline transactions or analysis tools.



#### Connecting to Existing Contracts

Once a Contract has been deployed, it can be connected to using the Contract object.

new . **Contract ( addressOrName , abi , providerOrSigner )**
>Connects to the contract at *addressOrName* defined by *abi*, connected as *providerOrSigner*.
>
>For supported formats for *abi*, see Contract ABI.
>
>For access capabilities and restrictions, see Providers vs Signers


*prototype* . **address**
>The address (or ENS name) of the contract.

*prototype* . **deployTransaction**
>If the contract was deployed by a ContractFactory, this is the transaction used to deploy it, otherwise it is null.

*prototype* . **interface**
>The Interface meta-class of the parsed ABI. Generally, this should not need to be accessed directly.

Additional properties will be added to the prototype at run-time, based on the ABI provided, see Contract Meta-Class.

*prototype* . **deployed ( )**   =>   Promise<Contract>
>If the contract is the result of <span style="color:red;">deploy()</span>, returns a Promise that resolves to the contract once it has been mined, or rejects if the contract failed to deploy. If the contract has been deployed already, this will return a Promise that resolves once the on-chain code has been confirmed.



#### Meta-Class Properties

Since a Contract is dynamic and loaded at run-time, many of the properties that will exist on a Contract are determined at run-time from the Contract ABI.

All functions populated from the ABI are also included on the contract object directly, for example <span style="color:red;">contract.functions.getValue()</span> can also be called using <span style="color:red;">contract.getValue()</span>.

*prototype* . **functions . functionName**
>An object that maps each ABI function name to a function that will either call (for constant functions) or sign and send a transaction (for non-constant functions)
>
>Calling a **Constant** function requires either a Provider or a Signer with a Provider.
>
>Calling a **Non-Constant** function (i.e. sending a transaction) requires a Signer.

*prototype* . **estimate . functionName**
>An object that maps each ABI function name to a function that will estimate the cost the provided parameters.

Filters allow for a flexible and efficient way to fetch only a subset of the events that match specific criteria. The <span style="color:red;">filters</span> property contains a function for every Event in the ABI that computes a Filter for a given set of values. The <span style="color:red;">null</span> matches any value.

*prototype* . **filters . eventname**
>A function that generates filters that can be listened to, using the <span style="color:red;">on(eventName, ...)</span> function, filtered by the Event values.



#### Event Emitter

Each Contract supports many of the operations available from the Event Emitter API.

To listen for Events, the contract requires either a Provider or a Signer with a Provider.

The available eventNames are:

* **string** – The name of an event (e.g. "TestEvent" or "TestEvent(string, uint)")
* **filter** – See Contract Filters
* *– All events

All event callbacks receive the parameters specified in the ABI as well as one additional Event Object with

* **blockNumber, blockHash, transactionHash** – The Block and Transaction of the Log
* **address** – The contract address for the Log
* **data** – The Log data
* **topics** – An array of the Log topics
* **args** – An array of the parsed arguments for the event
* **event** – the name of the event (e.g. "Transfer")
* **eventSignature** – the full signature of the event (e.g. "Transfer(address,address,uint256)")
* **getBlock()** – A function that resolves to the Block containing the Log
* **getTransaction()** – A function that resolves to the Transaction containing the Log
* **getTransactionReceipt()** – A function that resolves to the Transaction Receipt containing the Log
* **removeListener()** – A function that removes this callack as a listener
* **decode(data, topics)** – A function that decodes data and topics into parsed arguments

*prototype* . **on ( eventName , callback )**   =>   Contract
>Registers *callback* to be called on every *eventName*. Returns the contract, so calls may be chained.

*prototype* . **addListner ( eventName , callback )**   =>   Contract
>An alias for <span style="color:red;">on</span>.

*prototype* . **once ( eventName , callback )**   =>   Contract
>Register *callback* to be called at most once, for *eventName*. Returns the contract, so calls may be chained.

*prototype* . **emit ( eventName , … )**   =>   boolean
>Trigger all callbacks for *eventName*, returning true if there was at least one listener. This should generally not be called directly.

*prototype* . **listenerCount ( [ eventName ] )**   =>   number
>Returns the number of callbacks registered for *eventName*.

*prototype* . **listeners ( eventName )**   =>   Listeners[]
>Returns a list of callbacks for *eventName*.

*prototype* . **removeAllListeners ( eventName )**   =>   Contract
>De-registers all listeners for *eventName*. Returns the contract, so calls may be chained.

*prototype* . **removeListener ( eventName , callback )**   =>   Contract
>De-registers the specific *callback* for *eventName*. Returns the contract, so calls may be chained.




## Utilities

The utility functions provide a large assortment of common utility functions required to write dapps, process user input and format data.

#### Addresses

There are several formats available to represent RSK addresses and various ways they are determined.

*utils* . **getAddress ( address )**   =>   Address
>Normalize any supported address-format to a checksum address.

*utils* . **getContractAddress ( transaction )**   =>   Address
>Computes the contract address of a contract deployed by *transaction*. The only properties used are *from* and *nonce*.


#### Arrish
An arrayish object is used to describe binary data and has the following conditions met:

* has a length property
* has a value for each index from 0 up to (but excluding) length
* has a valid byte for each value; a byte is an integer in the range [0, 255]
* is not a string

*utils* . **isArrayish ( object )**   =>   boolean
>Returns true if object can be treated as an arrayish object.

*utils* . **arrayify ( hexStringOrBigNumberOrArrayish )**   =>   Uint8Array
>Returns a Uint8Array of a hex string, BigNumber or of an Arrayish object.

*utils* . **concat ( arrayOfHexStringsAndArrayish )**   =>   Uint8Array
>Return a Uint8Array of all arrayOfHexStringsAndArrayish concatenated.

*utils* . **padZeros ( typedUint8Array, length )**  =>   Uint8Array
>Return a Uint8Array of typedUint8Array with zeros prepended to length bytes.

*utils* . **stripZeros ( hexStringOrArrayish )**   =>   Uint8Array
>Returns a Uint8Array with all leading zero bytes striped.



#### Bytes32 Strings
Often for short strings, it is far more efficient to store them as a fixed, null-terminated bytes32, instead of a dynamic length-prefixed bytes.

*utils* . **formatBytes32String ( text )**   =>   hex
>Returns a hex string representation of text, exactly 32 bytes wide. Strings >must be 31 bytes or shorter, or an exception is thrown.

>NOTE: Keep in mind that UTF-8 characters outside the ASCII range can be multiple bytes long.

*utils* . **parseBytes32String ( hexStringOrArrayish )**   =>   string
>Returns hexStringOrArrayish as the original string, as generated by formatBytes32String.


#### Big Numbers

A BigNumber is an immutable object which allow accurate math operations on values larger than JavaScript can accurately handle can safely handle.

*prototype* . **add ( otherValue )**   =>   BigNumber
>Return a new BigNumber of this plus *otherValue*.

*prototype* . **sub ( otherValue )**   =>   BigNumber
>Return a new BigNumber of this minus *otherValue*.

*prototype* . **mul ( otherValue )**   =>   BigNumber
>Return a new BigNumber of this times *otherValue*.

*prototype* . **div ( otherValue )**   =>   BigNumber
>Return a new BigNumber of this divided by *otherValue*.

*prototype* . **mod ( otherValue )**   =>   BigNumber
>Return a new BigNumber of this modulo *otherValue*.

*prototype* . **maskn ( bits )**   =>   BigNumber
>Return a new BigNumber with the number of *bits* masked.

*prototype* . **eq ( otherValue )**   =>   boolean
>Return true if this is equal to *otherValue*.

*prototype* . **lt ( otherValue )**   =>   boolean
>Return true if this is less than *otherValue*.

*prototype* . **lte ( otherValue )**   =>   boolean
>Return true if this is less or equal to *otherValue*.

*prototype* . **gt ( otherValue )**   =>   boolean
>Return true if this is greater than *otherValue*.

*prototype* . **gte ( otherValue )**   =>   boolean
>Return true if this is greater than or equal to *otherValue*.

*prototype* . **isZero ( )**   =>   boolean
>Return true if this is equal to zero.

*prototype* . **toNumber ( )**   =>   number
>Return a JavaScript number of the value.
>
>An error is thrown if the value is outside the safe range for JavaScript IEEE 754 64-bit floating point numbers (over 53 bits of mantissa).

*prototype* . **toString ()**   =>   string
>Return a decimal string representation.

*prototype* . **toHexString ( )**   =>   hex
>Return a hexstring representation of the value.

*utils* . **bigNumberify ( value )**   =>   BigNumber
>Returns a BigNumber instance of *value*. The *value* may be anything that can reliably be converted into a BigNumber:

**Type** | **Examples** | **Notes**
-------- | ------------ | ---------
decimal string | <span style="color:red;">"42", "-42"</span>	 
hexadecimal string | <span style="color:red;">"0x2a", "-0x2a"</span> | case-insensitive
numbers | <span style="color:red;">42, -42</span> | must be witin the safe range
Arrayish | <span style="color:red;">[ 30, 252 ]</span> | big-endian encoding
BigNumber | any other BigNumber | returns the same instance

#### Cryptographic Functions

*utils* . **computeAddress ( publicOrPrivateKey )**   =>   Address
>Computes the RSK address given a public key or private key.

*utils* . **computePublicKey ( publicOrPrivateKey [ , compressed = false ] )**   =>   hex
>Compute the public key for *publicOrPrivateKey*, optionally *compressed*. If *publicOrPrivateKey* is a public key, it may be either compressed or uncompressed.

*utils* . **recoverAddress ( digest , signature )**   =>   Address
>Returns the RSK address by using ecrecover with the *digest* for the *signature*.

*utils* . **recoverPublicKey ( digest , signature )**   =>   hex
>Returns the public key by using ecrecover with the *digest* for the *signature*.

*utils* . **verifyMessage ( messageStringOrArrayish , signature )**   =>   Addresss
>Returns the address of the account that signed *messageStringOrArrayish* to generate signature.



#### Hex Strings
A hex string is always prefixed with “0x” and consists of the characters 0 – 9 and a – f. It is always returned lower case with even-length, but any hex string passed into a function may be any case and may be odd-length.

*utils* . **hexlify ( numberOrBigNumberOrHexStringOrArrayish ) **  =>   hex
>Converts any number, BigNumber, hex string or Arrayish to a hex string. (otherwise, throws an error)

*utils* . **isHexString ( value ) **  =>   boolean
>Returns true if value is a valid hexstring.

*utils* . **hexDataLength ( hexString )**   =>   number
>Returns the length (in bytes) of hexString if it is a valid data hexstring (even length).

*utils* . **hexDataSlice ( hexString , offset [ , endOffset ] )**   =>   hex
>Returns a string for the subdata of hexString from offset bytes (each byte is two nibbled) to endOffset bytes. If no endOffset is specified, the result is to the end of the hexString is used. Each byte is two nibbles.

*utils* . **hexStripZeros ( hexString ) **  =>   hex
>Returns hexString with all leading zeros removed, but retaining at least one nibble, even if zero (e.g. 0x0). This may return an odd-length string.

*utils* . **hexZeroPad ( hexString , length )**   =>   hex
>Returns hexString padded (on the left) with zeros to length bytes (each byte is two nibbles).


#### Transactions

*utils* . **serializeTransaction ( transaction [ , signature ] )**   =>   hex
>Serialize transaction as a hex-string, optionally including the signature.

>If signature is provided, it may be either the Flat Format or the Expanded >Format, and the serialized transaction will be a signed transaction.

*utils* . **parseTransaction ( rawTransaction ) **  =>   Transaction
>Parse the serialized transaction, returning an object with the properties:
>
> * to
> * nonce
> * gasPrice
> * gasLimit
> * data
> * value
> * chainId
>
>If the transactions is signed, addition properties will be present:
>
> * r, s and v — the signature public point and recoveryParam (adjusted for the chainId)
> * from — the address of the account that signed the transaction
> * hash — the transaction hash


#### UTF-8 Strings
*utils* . **toUtf8Bytes ( string ) **  =>   Uint8Array
>Converts a UTF-8 string to a Uint8Array.

*utils* . **toUtf8String ( hexStringOrArrayish , [ ignoreErrors = false ) **  =>   string
>Converts a hex-encoded string or array to its UTF-8 representation.

## Top Layer
The RSK Key Management Top Layer provides Account Management interfaces, API interfaces (Python, JS) and Provider handler to interact with RSK provider networks (Local, Public, and 3rd party operated).

#### **connect (provider-network)** 
> Connect to an RSK node network

For RSK recommended providers, please refer to []

#### **create_wallet**
>Create a wallet with a label & master encrypted passphrase choose between using a hardware wallet, generating Keystore file or a mnemonic phrase.

Example:
* create_wallet MyWallet1_Label -pass (prompted to enter password);
* create_wallet MyWallet1_Label -mnemonic “.... ….”;

#### **set_wallet_label**

>Sets the local wallet label to a new label

Usage: 
* set_wallet_label MyWallet1 My-Developer-Wallet

#### **import_wallet**
>Import existing wallet’s accounts as a new Wallet using a private key or encrypted JSON keystore

Usage: 
* import_wallet MyWallet1 -json mywallet1.json 
* NewEncryptedPass (prompted to enter the old encrypted password) 

#### **recover_wallet_mnemonic**
>Recover a wallet using a mnemonic phrase

#### **create_new_account**
Usage:
* Create_new_account MyWallet1 [label_new_account]
* Output: New account created 0x……. with label Account1 for wallet MyWallet1

#### **import_account**
>Import an existing account

Usage: 
* import 0x…. <from_Wallet2> <to_myWallet1>

#### **export** 
>Export the keyset for a wallet

#### **get_dev_coins [RIF or RBTC]**
>Quickly get rBTC or RIF testnet funds from faucets. 
( Only works if you are connected to RSK-Testnet. )

Usage: 
* get_dev_coins RIF MyWallet1 Account1
* Output: Account1 in MyWallet1 has received 100 RIF tokens 


#### **contract_create**
>Creates a new contract instance with all methods and events defined in the interface 

Usage: 
* contract_create(Interface, address, options)

#### **contract_method**
>Create a transaction object for a method that can be called, sent, estimated

#### **ttcontract_event_subscribe_once**
>Subscribes to an event only once

#### **contract_event_subscribe**
>Subscribes to an event

#### **contract_allevents**
>Receives all events from this smart contract, or filter events.

#### **contract_pastevents**
>Gets past events for this contract.

#### **view_accounts**
>Show accounts for existing wallet using a variety of methods [ hardware, web3, private key, keystore, mnemonic]

Usage:
* view_accounts MyWallet1 <encrypted_passphrase>

#### **get_balance**
>Get balance of accounts in a wallet, or specify a specific account

Usage: 
* get_balance MyWallet1  OR   get_balance MyWallet1 0xAccountInfo

#### **pay, payment**
>to, amount, account from, fee

#### **paytomany**
>Pay to many

#### **signMsg, signTx**
>Signing of messages or transactions

Usage: 
* signTx(tx, privatekey, callback)

#### **check_tx_status**
>Check the transaction status of a txID

#### **build_tx**
>build_tx(account, amount, gas, nonce, gasPrice, data)
#### **send_tx**
>Sends a signed transaction

Usage: 
* sendtx(0x + hex_string)

## Providers 

A Provider abstracts a connection to the RSK blockchain, for issuing queries and sending signed state changing transactions.

The JsonRpcProvider allows you to connect to RSK nodes you control or have access to, including mainnet and testnets.

For most situations, it is recommended that you use a default provider.

## Connecting to RSK

#### getDefaultProvider

**.getDefaultProvider ([network =** *"homestead"* **]) => Provider**
>This creates a FallbackProvider backed by multiple backends.
>
>This is the **recommended** method of connecting to the network if you are not running your own RSK node.

**new providers.JsonRpcProvider([ urlOrInfo =** *"http://localhost:8545"* **][ ,network ])**
>Connect to the JSON-RPC API URL urlorInfo of an RSK node
>
>The urlOrInfo may also be specified as an object with the properties:

 * **url** — the JSON-RPC URL (required).
 * **user** — a username to use for Basic Authentication (optional).
* **password** — a password to use for Basic Authentication (optional).
* **allowInsecure** — allow Basic Authentication over an insecure HTTP network (default: false).

**Also See**: JSON-RPC provider-specific [Properties](#JsonRpcProvider).

## Properties

#### Provider
*prototype* . **blockNumber**
>The most recent block number (block height) this provider has seen and has triggered events for. If no block has been seen, this is null.

*prototype* . **polling**
*mutable*

>If the provider is currently polling because it is actively watching for events. This may be set to enable/disable polling temporarily or disabled permanently to allow a node process to exit.

*prototype* . **pollingInterval**
*mutable*

>The frequency (in ms) that the provider is polling. The default interval is 4 seconds.

>This may make sense to lower for PoA networks or when polling a local node.

#### <div id="JsonRpcProvider">JsonRpcProvider</div>

*prototype* . **connection**
>An object describing the connection of the JSON-RPC endpoint with the properties:
>
>* **url** — the JSON-RPC URL
>* **user** — a username to use for Basic Authentication (optional)
>* **password** — a password to use for Basic Authentication (optional)
>* **allowInsecure** — allows Basic Authentication over an insecure HTTP network




## Account 

*prototype* . **getBalance( addressOrName [ , blockTag =** *“latest”* **] )   =>   Promise<BigNumber>**
>Returns a Promise with the balance (as a BigNumber).

*prototype* . **getTransactionCount ( addressOrName [ , blockTag =** *“latest”* **] )   =>   Promise<number>**

>Returns a Promise with the number of sent transactions (as a Number). This is also the nonce required to send a new transaction.

## Blockchain Status
*prototype* **. getBlockNumber ( )   =>   Promise<number>**
>Returns a Promise with the latest block number (as a Number).

*prototype* . **getGasPrice ( )   =>   Promise<BigNumber>**
>Returns a Promise with the current gas price (as a BigNumber).

*prototype* **. getBlock ( blockHashOrBlockNumber )   =>   Promise<Block>**
>Returns a Promise with the block at blockHashOrBlockNumber.

*prototype* **. getTransaction ( transactionHash )   =>   Promise<TransactionResponse>**
>Returns a Promise with the transaction with transactionHash. 

*prototype* **. getTransactionReceipt ( transactionHash )   =>   Promise<TransactionReceipt>**
>Returns a Promise with the transaction receipt with transactionHash. (See: Transaction Receipts)