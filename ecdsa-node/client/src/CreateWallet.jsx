import * as utils from './Utils';
import server from "./server";
import {toHex} from "ethereum-cryptography/utils";

function NewWallet( { address, setAddress, privateKey, setPrivateKey } ) {

    async function createWallet(evt) {
        evt.preventDefault();
        try {
            const privateKey = utils.generatePrivateKey();
            const response = await server.post(`create`, { publicKey : utils.getPublicKey( privateKey ) });
            if ( response.status === 200 && response.data.address ) {
                setAddress( response.data.address );
                setPrivateKey( privateKey );
            }
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

    return (
        <form className="container transfer" onSubmit={createWallet}>
            <h1>Don't have a wallet ?</h1>
            <label>
                Generate your wallet here:
                <input type="submit" className="button" value="Generate Wallet" />
            </label>
            <label>
                Your Generated Wallet Address
                <input placeholder = {"Your generated wallet address..."} value = {address} readOnly></input>
            </label>
            <label>
                Your Generated Private Key
                <p style = {{ color : "red" }} >Save this locally, if you loose it you want have access to your wallet !!!</p>
                <input placeholder = {"Your generated private key..."} value = {privateKey} readOnly></input>
            </label>
        </form>
    );
}

export default NewWallet;
