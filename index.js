// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Extract the public and private key from the keypair. Use CLI publicKey, if present.
if (process.argv.slice(2) != ""){
    publicKey = new PublicKey(process.argv.slice(2).toString());
}
else {
    publicKey = new PublicKey(newPair._keypair.publicKey).toString();
}
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the randomly generated keypair:", new PublicKey(newPair._keypair.publicKey).toString());

// Get the wallet balance from a given public key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        //console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const myWallet = new PublicKey(publicKey);
        const walletBalance = await connection.getBalance(
            myWallet
        );
        console.log(myWallet + ` - balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        // Connect to the Devnet and make a wallet from publicKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = new PublicKey(publicKey);

        // Request airdrop of 2 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(
            myWallet,
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

mainFunction();
