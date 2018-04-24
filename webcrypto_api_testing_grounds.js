//testing ground file
//alert ("hello! world!")
//document.write("That was a test of the alert functionality")

function genkey_rss(modlen) {
  return window.crypto.subtle.generateKey(
      {
          name: "RSA-PSS",
          modulusLength: modlen, //can be 1024, 2048, or 4096
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["sign", "verify"] //can be any combination of "sign" and "verify"
  );
}

function genkey_hmac() {
  return window.crypto.subtle.generateKey(
      {
          name: "HMAC",
          hash: {name: "SHA-256"}
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ["sign", "verify"] //can be any combination of "sign" and "verify"
  );
}



function expkey(publick) {
  return window.crypto.subtle.exportKey(
      "spki", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
      publick //can be a publicKey or privateKey, as long as extractable was true
  );
}


function sign(data, privatek) {
  return window.crypto.subtle.sign(
    {
        name: "RSA-PSS",
        saltLength: 128, //the length of the salt
    },
    privatek,
    data
  );
}


genkey_hmac()
.then(function(key){
    //returns a keypair object
    console.log(key);
    //console.log(key.publicKey);
    //console.log(key.privateKey);
    window.crypto.subtle.sign(
     {
         name: "HMAC"
     },
     key,
     new ArrayBuffer("Hello world!! This is a message to sign")
   );
})
.then(function(signature) {
  console.log("Signature now is: ", signature);
})

//document.write("key now is: ", key)

//.then(window.crypto.subtle.exportKey( "jwk", key.publickey))
//.then(function(keydata) {
//  console.log(keydata)
//})
