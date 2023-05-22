import * as utils from './Utils';
import server from "./server";
import {getPublicKey, isValidAddress} from "./Utils";
function Wallet({address, setAddress, balance, setBalance, privateKey, setPrivateKey, setCanTransfer}) {

    const setValue = (setter) => (evt) => setter(evt.target.value);
    async function onSubmit( evt ) {
        evt.preventDefault();

        try {
            if (address && privateKey) {
                if( ! isValidAddress( address, privateKey) ) {
                    throw new DOMException(" Invalid private_key/address pair");
                }
                const message = {};
                message.address = address;
                message.nonce = 0;

                const requestData = {
                    message: message,
                    signature: await utils.signMessage(JSON.stringify(message), privateKey),
                };

                const {
                    data: {balance},
                } = await server.post(`balance/${address}`, requestData);
                setBalance(balance);
                setCanTransfer(true);
            } else {
                setBalance(0);
            }
        } catch ( ex ) {
            if( ex.message.includes('private key') ) {
                alert("Invalid Private Key");
            } else {
                alert( ex.message );
            }
        }
    }

    return (
        <form className="container transfer" onSubmit={onSubmit}>
            <h1>Your Wallet</h1>

            <label>
                Wallet Address
                <input name="address" placeholder="Type your wallet address, for example: abcd..." value={address}
                       onChange={setValue(setAddress)}></input>
            </label>

            <label>
                Private Key
                <input name="privateKey" placeholder="Type your private key, for example: sajdfhj32..."
                       value={privateKey} onChange={setValue(setPrivateKey)}></input>
            </label>

            <div className="balance">Balance: {balance}</div>

            <input type="submit" className="button" value="Access Wallet" />
        </form>
    );
}

export default Wallet;
