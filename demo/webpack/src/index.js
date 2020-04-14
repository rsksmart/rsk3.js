import Rsk3 from 'rsk3';

const rsk3 = new Rsk3('https://public-node.testnet.rsk.co');
let account;

function main() {
    const blockHeightButton = document.getElementById('block_height_button');
    blockHeightButton.onclick = fetchLatestBlockHeight;

    const txButton = document.getElementById('tx_button');
    txButton.onclick = renderTransaction;

    const privateKeyButton = document.getElementById('private_key_button');
    privateKeyButton.onclick = createWallet;

    const transferButton = document.getElementById('transfer_button');
    transferButton.onclick = renderSendTx;
}

async function fetchLatestBlockHeight() {
    const blockHight = await rsk3.getBlockNumber();
    const element = document.getElementById('block_height_div');
    element.innerText = `Latest Block Height: ${blockHight}`;
}

async function createWallet() {
    const privateKeyInput = document.getElementById('private_key_input');
    const privateKey = privateKeyInput.value;
    account = rsk3.accounts.privateKeyToAccount(privateKey);
    const { address } = account;

    renderPublicKey(address);
    renderBalance(address);
}

function renderPublicKey(publicKey) {
    const element = document.getElementById('public_key');
    element.innerText = `Public key: ${publicKey}`;
}

async function renderBalance(address) {
    const element = document.getElementById('balance');
    const balance = await rsk3.getBalance(address);
    element.innerText = `Balance: ${balance}`;
}

async function renderTransaction() {
    const txInput = document.getElementById('tx_input');
    const hash = txInput.value;
    const element = document.getElementById('transaction');
    const transaction = await rsk3.getTransaction(hash);
    element.innerText = `Transaction: ${JSON.stringify(transaction, null, 2)}`;
}

async function renderSendTx() {
    const receiverInput = document.getElementById('receiver_address');
    const receiver = receiverInput.value;
    const transferInput = document.getElementById('transfer_value');
    const transferValue = transferInput.value;

    const resSignedTx = await signTransaction({
        to: receiver,
        value: transferValue,
    });

    console.log('resSignedTx', resSignedTx);
    const element = document.getElementById('hash');
    element.innerText = `Hash: ${resSignedTx}`;
}

async function signTransaction({ to, value, gas = 54000, gasPrice = 100000000, chainId = 31 }) {
    const { address, privateKey } = account;
    const nonce = await rsk3.getTransactionCount(address, 'pending');
    console.log('nonce', nonce);

    const { rawTransaction } = await rsk3.accounts.signTransaction({
        to,
        value: Rsk3.utils.toHex(value),
        nonce,
        gas,
        gasPrice,
        chainId,
    }, privateKey);
    console.log('rawTransaction', rawTransaction);

    const resSignedTx = await new Promise(resolve => {
        rsk3.sendSignedTransaction(rawTransaction)
            .on('transactionHash', (hash) => {
                return resolve(hash);
            });
    })
    return resSignedTx;
}

main();
