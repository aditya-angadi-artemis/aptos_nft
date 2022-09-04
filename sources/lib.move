module BatchMinter::batchmint {
    use 0x1::signer;
    use 0x1::account::{Self, SignerCapability};
   // use 0x1::coins;
    use 0x1::coin;
    use 0x1::aptos_coin::AptosCoin;
    use 0x1::managed_coin;
    use 0x3::token;
    use std::string::String;

    //Setup A new Collection

    public entry fun init_collection(admin: &signer, name: String, 
    description:String, uri: String, maximum: u64,) {
        //Create Collection
        //DESCRIPTION MUTABLE
        //URI MUTABLE
        //MAX MUTALBE
        let mutability_config: vector<bool> = vector<bool>[false, false, false];
        token::create_collection_script(admin, name,
        description, uri, maximum, mutability_config);

    }

    public entry fun create_a_token(admin: &signer,
    collection_name: String,
    name: String,
    description: String,
    balance: u64,
    maximum: u64,
    uri:String,
    royalty_payee_address: address,
    royalty_points_denominator: u64,
    royalty_points_numerator:u64,
    mutate_settings: vector<bool>,
    property_keys: vector<String>, 
    property_values: vector<vector<u8>>,
    property_types: vector<String> ) {

        token::create_token_script(admin, collection_name, name, description,
        balance, maximum, uri, royalty_payee_address, royalty_points_denominator,
        royalty_points_numerator, mutate_settings, property_keys,
        property_values, property_types);

    }

}