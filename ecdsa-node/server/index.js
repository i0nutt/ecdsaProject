const Transaction = require("./Transaction");
const BalanceList = require('./BalanceList');
const secp = require('ethereum-cryptography/secp256k1');
const {toHex, utf8ToBytes} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const addressSize = 20;
const { hashMessage, getAddress } = require('./utils');
app.use(cors());
app.use(express.json());

const balances = BalanceList.getInstance();

app.post('/balance/:address', (req, res) => {
    const {address} = req.params;
    const {message} = req.body;
    const signature = Uint8Array.from( Object.values(req.body.signature[0]) );
    const recovery  = req.body.signature[1];
    const publicKey = secp.recoverPublicKey(hashMessage(JSON.stringify(message)), signature, recovery);

    let balance = 0;

    if ( ! balances.hasBalance( address ) ) {
        res.status(400).send({message: 'Your wallet address is invalid !'});
    } else {
        balance = balances.getBalance( address );
        res.send({balance});
    }
});

app.post('/create', (req, res) => {
    const publicKey = Uint8Array.from( Object.values( req.body.publicKey ) );
    const address = getAddress( publicKey );
    balances.createBalance( address,  100 );// everyone starts with 100

    res.status(200).send({address: address});
});

app.post('/send', (req, res) => {
    const {message} = req.body;

    if ( ! balances.hasBalance( message.sender ) ) {
        res.status(400).send({message: 'Your wallet address is invalid !'});
        return;
    }

    if ( ! balances.hasBalance( message.recipient ) ) {
        res.status(400).send({message: 'The address you are sending to is invalid !'});
        return;
    }

    const transaction = new Transaction( message.sender, message.recipient, message.amount, message.nonce);

    if( transaction.isSigned(req.body.signature) && transaction.doTransaction() ) {
        res.send({balance: balances.getBalance( message.sender) });
    } else {
        res.status(400).send({message: 'Transaction refused, check if you have enough founds or try again !'});
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

module.exports = balances;
