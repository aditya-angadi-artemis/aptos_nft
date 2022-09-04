import { AptosAccount, AptosClient, HexString } from "aptos";
import {
  AccountAddress,
  ChainId,
  RawTransaction,
  EntryFunction,
  TypeTagStruct,
  StructTag,

//   ScriptFunction,
 TransactionPayloadScript,
 TransactionPayloadEntryFunction
} from "aptos/dist/transaction_builder/aptos_types";

import {
    BCS,
    FaucetClient
   } from "aptos"

const contractAddress = "b62e088925d95f36b2a2663f445f1ea99565c1c27def1c003415c0da45a88202";

const DEVNET_URL = "https://fullnode.devnet.aptoslabs.com/v1";
//const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const faucetClient = new FaucetClient(DEVNET_URL, FAUCET_URL);

const ADMIN_PRIV_KEY = new HexString(
    "0xb977a06e80759611a7abcd23ff775000e8b34592cbeb9433942005689e287396"
  ).toUint8Array();

const aptosClient = new AptosClient(DEVNET_URL);
const admin = new AptosAccount(ADMIN_PRIV_KEY);

const setupCollection = async () => {

    console.log("Doing a setup collection");
    let name = "COLL1";
    let description = "LEARNING APTOS";
    let uri = "https://optnegynvvvwodqguonc.supabase.co/storage/v1/object/public/topaz-badges/badge-week-two.png";
    let mx = 1
    const ef = EntryFunction.natural(`${contractAddress}::batchmint`,
    "init_collection", [], [BCS.bcsSerializeStr(name),
        BCS.bcsSerializeStr(description),
        BCS.bcsSerializeStr(uri),
    BCS.bcsSerializeUint64(mx)]);
    const txPayloadEntryFunction = new TransactionPayloadEntryFunction(ef);

    const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
      aptosClient.getAccount(admin.address()),
      aptosClient.getChainId(),
    ]);

    const rawTx = new RawTransaction(
   
      AccountAddress.fromHex(admin.address()),
      BigInt(sequenceNumber),
      txPayloadEntryFunction,
      2000n,
      1n,
      BigInt(Math.floor(Date.now() / 1000) + 10),
      new ChainId(chainId)
    );
    const signedTx = AptosClient.generateBCSTransaction(admin, rawTx);

    console.log("Sending TX");
    try {
      const response = await aptosClient.submitSignedBCSTransaction(signedTx);
      console.log("Sent Tx");
      await aptosClient.waitForTransaction(response.hash);
      console.log("Swap response is");
      console.log("Response is", response.hash);
    
    } catch(e) {
      console.log("e is ", e);
      console.log(typeof(e));
     // console.log(e.request);
    }
}

const mintOneToken = async () => {

  console.log("Minting a token");
  let collection_name = "COLL1";
  let token_name = "ANGADITOKEN1";
  let description = "AGDTOK";
  let balance = 1;
  let maximum = 1;
  let uri = "https://optnegynvvvwodqguonc.supabase.co/storage/v1/object/public/topaz-badges/badge-week-two.png";
  let royalty_payee_address = admin.address();
  let royalty_points_denominator = 100;
  let royalty_points_numerator = 5;
  let mutate_settings: Array<boolean> = [false, false, false]; 
  let property_keys: Array<string> = [];
  let property_values: Array<string> = [];
  let property_types: Array<string> = [];   
  const ef = EntryFunction.natural(`${contractAddress}::batchmint`,
  "create_a_token", [], [BCS.bcsSerializeStr(collection_name),
      BCS.bcsSerializeStr(token_name), BCS.bcsSerializeStr(description),
      BCS.bcsSerializeUint64(balance), BCS.bcsSerializeUint64(maximum),
      BCS.bcsSerializeStr(uri), BCS.bcsToBytes(AccountAddress.fromHex(royalty_payee_address)),
      BCS.bcsSerializeUint64(royalty_points_denominator),
      BCS.bcsSerializeUint64(royalty_points_numerator), 
      BCS.bcsSerializeStr(mutate_settings.toLocaleString()),
      BCS.bcsSerializeStr(property_keys.toLocaleString()),
      BCS.bcsSerializeStr(property_values.toLocaleString()),
      BCS.bcsSerializeStr(property_types.toLocaleString())
    ]);
  const txPayloadEntryFunction = new TransactionPayloadEntryFunction(ef);

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    aptosClient.getAccount(admin.address()),
    aptosClient.getChainId(),
  ]);

  const rawTx = new RawTransaction(
 
    AccountAddress.fromHex(admin.address()),
    BigInt(sequenceNumber),
    txPayloadEntryFunction,
    2000n,
    1n,
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new ChainId(chainId)
  );
  const signedTx = AptosClient.generateBCSTransaction(admin, rawTx);

  console.log("Sending TX");
  try {
    const response = await aptosClient.submitSignedBCSTransaction(signedTx);
    console.log("Sent Tx");
    await aptosClient.waitForTransaction(response.hash);
    console.log("Swap response is");
    console.log("Response is", response.hash);
  
  } catch(e) {
    console.log("e is ", e);
    console.log(typeof(e));
   // console.log(e.request);
  }

}

console.log("nft-runner");
//setupCollection()
mintOneToken();