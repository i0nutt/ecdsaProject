import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import {useState} from "react";
import NewWallet from "./CreateWallet";

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [generatedAddress, setGeneratedAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [generatedPrivateKey, setGeneratedPrivateKey] = useState("");
    const [canTransfer, setCanTransfer] = useState("");
    return (
        <div className="app">
            <NewWallet
                address={generatedAddress}
                setAddress={setGeneratedAddress}
                privateKey={generatedPrivateKey}
                setPrivateKey={setGeneratedPrivateKey}
            />
            <Wallet
                balance={balance}
                setBalance={setBalance}
                address={address}
                setAddress={setAddress}
                privateKey={privateKey}
                setPrivateKey={setPrivateKey}
                setCanTransfer={setCanTransfer}
            />
            {canTransfer ?
            <Transfer
                setBalance={setBalance}
                address={address}
                privateKey={privateKey}
            /> : null }
        </div>
    );
}

export default App;
