var gen_promise = null;
var private_key_object = null;
var public_key_object = null;

//var algname = "RSASSA-PKCS1-v1_5";
//var algname = "RSA-PSS";
var data1 = "This is a message...!";
var data2 = "This is another message...!";

var encrypted_hash = null;
var sign_promise = null;
var signature = null;
var verify_promise = null;
var last_verification = null;

//alert("Cryptography API Supported");


function test_alert() {
  alert("Cryptography API!!");
}

function stringToArrayBufferView(str)
{
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++)
    {
        bytes[iii] = str.charCodeAt(iii);
    }
    return bytes;
}


function gen_key_sign(algname, hashmethod, mlen, saltlen, mess)
{
     gen_promise = crypto.subtle.generateKey(
        {name: algname,
         modulusLength: mlen,
         publicExponent: new Uint8Array([1, 0, 1]),
         hash: {name: hashmethod}},

         false,
         ["sign", "verify"]);

      gen_promise.then(
        function(key){
          private_key_object = key.privateKey;
          public_key_object = key.publicKey;
          console.log("public key is: ", public_key_object)
          console.log("private key is: ", private_key_object)
          sign_data(mess, algname, saltlen)
      },

        function(e){
        console.log(e.message);
      })
}


function sign_data(mess, algname, salt)
{
    sign_promise = crypto.subtle.sign(
      {
        name: algname,
        saltLength: salt
      },
      private_key_object,
      stringToArrayBufferView(mess));

    sign_promise.then(
        function(result_signature){
            signature = result_signature; //signature generated
            console.log("Message signed: ", mess)
            console.log("resulting signature: ", signature)
            return signature;
            //verify_data();
          },
          function(e){
            console.log(e);
        });
}


function verify_data(mess, algname, salt)
{
    verify_promise = crypto.subtle.verify(
      {
        name: algname,
        saltLength: salt
      },
      public_key_object,
      signature,
      stringToArrayBufferView(mess));

    verify_promise.then(
        function(result){
            console.log(result);//true or false
            last_verification = result;
        },
        function(e){
            console.log(e.message);
        }
    );
}

function get_private_key(key_form) {
  export_promise = crypto.subtle.exportKey(key_form, public_key_object);
  export_promise.then(
    function(result) {
      console.log("result of exporting key: ", result)
    },
    function(e){
      console.log(e.message)
    })
}


function get_public_key() {
  return public_key_object;
}
