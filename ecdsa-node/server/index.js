const secp = require('ethereum-cryptography/secp256k1');
const {toHex, utf8ToBytes} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const addressSize = 20;
app.use(cors());
app.use(express.json());

const balances = {};

const addressMap = {};

app.post('/balance/:address', (req, res) => {
    const {address} = req.params;
    const {message} = req.body;
    const signature = Uint8Array.from( Object.values(req.body.signature[0]) );
    const recovery  = req.body.signature[1];
    const publicKey = secp.recoverPublicKey(hashMessage(JSON.stringify(message)), signature, recovery);

    let balance = 0;

    if (address === getAddress( publicKey ) ) {
        balance = balances[address] || 0;
    }

    res.send({balance});
});

app.post('/create', (req, res) => {
    const publicKey = Uint8Array.from( Object.values( req.body.publicKey ) );
    const address = getAddress( publicKey );
    balances[address] = 100; // everyone starts with 100

    res.status(200).send({address: address});
});

app.post('/send', (req, res) => {
    const {message} = req.body;

    const signature = Uint8Array.from( Object.values(req.body.signature[0]) );
    const recovery  = req.body.signature[1];
    const publicKey = secp.recoverPublicKey(hashMessage(JSON.stringify(message)), signature, recovery);

    if ( message.sender !== getAddress( publicKey )) {
        res.status(400).send({message: 'Unauthorized operation!'} );
    }

    setInitialBalance(message.sender);
    setInitialBalance(message.recipient);

    if (balances[message.sender] < message.amount ) {
        res.status(400).send({message: 'Not enough funds!'});
    } else {
        balances[message.sender] -= message.amount;
        balances[message.recipient] += message.amount;
        console.log(balances);
        res.send({balance: balances[message.sender]});
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}

function getAddress(publicKey) {
    const hashedKey = keccak256(publicKey.slice(1));

    return toHex(hashedKey.slice(-addressSize));
}

function hashMessage(message) {
    const bytesMessage = utf8ToBytes(message);
    return keccak256(bytesMessage);
}
