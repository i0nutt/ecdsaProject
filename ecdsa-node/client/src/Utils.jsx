import * as secp from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import {keccak256} from "ethereum-cryptography/keccak";

/**
 * Hash a message from a string
 *
 * @returns {*}
 * @param message
 */
function hashMessage( message ) {
    const bytesMessage = utf8ToBytes(message);
    return keccak256(bytesMessage);
}

/**
 *
 * @param message
 * @param privateKey
 * @returns {Promise<[U8A, number]>}
 */
async function signMessage(message, privateKey) {
    return secp.sign( hashMessage(message) , privateKey, { recovered : true } );
}

function generatePrivateKey() {
    return toHex( secp.utils.randomPrivateKey() );
}

function getPublicKey( privateKey ) {
    return secp.getPublicKey( privateKey );
}

function isValidAddress( address, privateKey ) {
    return address === getAddress( secp.getPublicKey( privateKey ) );
}

function getAddress(publicKey) {
    const hashedKey = keccak256(publicKey.slice(1));

    return toHex(hashedKey.slice(-20));
}

export { hashMessage, signMessage, generatePrivateKey, getPublicKey, isValidAddress };
