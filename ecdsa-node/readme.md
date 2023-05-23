## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions

For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder
2. Run `npm install` to install all the depedencies
3. Run `node index` to start the server

The application should connect to the default server port (3042) automatically!

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

My Additions to the app, App taken from https://university.alchemy.com , Ethereum crypto course, part 1, week project

The process of working on this project was the following :
etherum
1. Incorporate Public key cryptography
   - in order to make my life easier I created a create wallet form that would return me a wallet address and a private key generated locally. Of course in real life you wouldn't want such an element but for the purpose of this project I think is fine.
   - next I made a post request to the server with the public key in order to generate a wallet from the address derived from the public key
   - now I have the wallet address and the private key to create a signature
2. Changed the wallet element so that it would also require a private key
   - changed request type to post, used both address and private key to generate a signature and with it to authenticate the user to the server
   - the message would consist of address and a nonce ( 0 here, not that important, could be random )
   - the server would receive the same message and the signature and would verify against the derived public key if it matches the address from the message. If everything is right the user will be able to see his balance, otherwise the user would receive an alert saying that the input was wrong
3. Transfers would also use a signature, based on the private key that the user provided for accessing his wallet
   ( I could have gone into more detail to make the frontend more bulletproof but my focus was on the backend )

    - same as point 2. , created a message consisting of : sender address, recipient address, amount to transfer and a randomly generated nonce property ( just an int , I could have complicated this even further to use bigger numbers but this is not production in production )
    - created a signature based on the message and private key and sent the request with both to the server

   3.1.Now comes the most interesting part where I might have over-engineered the task :

   - on the server side I created a Block Chain like structure, using what I learned in the Block Chain related coding problems
   - to get the hash of a block I would use the Transaction class and only that class, class which has the following properties : sender, receiver, amount, nonce ( the message sent by the client basically)
   - a validation exists on the Transaction class to validate the signature
     - also important, the chain validation has two parts : 
        - first validate that the previous hash coincides with the last element ( if 2 elements exist)
        - second I would go over each block in the chain and make sure that the same hash didn't occur
   - if everything is good, the transaction would be made and registered in the Block Chain
   - 
All from 3.1. was done so that someone intercepting the transaction couldn't send it back to the server and have success, instead the operation will be rejected and a Transaction failed message would be the answer
