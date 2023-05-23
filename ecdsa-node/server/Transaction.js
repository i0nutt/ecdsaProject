const Block = require('./Block');
const Chain = require("./Chain");
const secp = require("ethereum-cryptography/secp256k1");
const {utf8ToBytes, toHex} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");
const { hashMessage, getAddress } = require('./utils');
const BalanceList = require('./BalanceList');
const balances = BalanceList.getInstance();
class Transaction {
    constructor(sender, recipient, amount, nonce ) {
        this.sender = sender;
        this.amount = amount;
        this.recipient = recipient;
        this.nonce = nonce;
    }

    /**
     * Do the transaction
     *
     * @returns {boolean} Whether the transaction was successful
     */
    doTransaction() {
        if ( balances.getBalance(this.sender) > this.amount ) {

            const chain = Chain.getInstance();
            const prevHash = chain.getTopElement() ? chain.getTopElement().hash : 0;
            const block = new Block(this, prevHash) ;
            block.hash();
            if ( chain.addBlock( block ) ) {
                balances.modifyBalance( this.recipient, this.amount);
                balances.modifyBalance( this.sender, - this.amount);

                return true;
            }
        }

        return false;
    }

    /**
     * Checks whether a valid signature was provided for the transaction or not
     *
     * @param {Object} signatureObject
     * @returns {boolean} Whether a valid signature was provided to this transaction
     */
    isSigned( signatureObject ) {
        const signature = Uint8Array.from( Object.values(signatureObject[0]) );
        const recovery  = signatureObject[1];
        const publicKey = secp.recoverPublicKey( hashMessage( JSON.stringify(this) ), signature, recovery );

        return this.sender === getAddress( publicKey );
    }
    toString() {
        return JSON.stringify( this );
    }
}

module.exports = Transaction;
