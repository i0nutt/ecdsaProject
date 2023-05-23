const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex} = require("ethereum-cryptography/utils");

class Block {
    transaction;
    prevHash;
    constructor( transaction , prevHash ) {
        this.transaction = transaction;
        this.prevHash = prevHash;
    }

    hash() {
        const stringObj = JSON.stringify( this.transaction );
        this.hash = toHex( keccak256( utf8ToBytes(stringObj) ) );
    }
}

module.exports = Block;
