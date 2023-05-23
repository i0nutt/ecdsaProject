const {utf8ToBytes, toHex} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");
const addressSize = 20;
function hashMessage(message) {
    const bytesMessage = utf8ToBytes(message);
    return keccak256(bytesMessage);
}

function getAddress(publicKey) {
    const hashedKey = keccak256(publicKey.slice(1));

    return toHex(hashedKey.slice(-addressSize));
}

module.exports =  { hashMessage, getAddress };
