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
var read_public_key =null;

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

         true,
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
            signature = result_signature
            console.log("Message signed!!!!!!!!!!!!!!!!");
            console.log("Resulting signature: ", signature)
            console.log("Resulting signature in hex: ", buf2hex(signature))
            for (var e in signature) {
              console.log(e);
            }
            document.getElementById("log").innerHTML += "</br></br>Message signed."
            document.getElementById("log").innerHTML += "</br></br>resulting signature: </br></br> " +  buf2hex(signature) + "</br></br>";
            //verify_data();
          },
          function(e){
            console.log(e);
        });
}


function verify_data(mess, read_signature, algname, hashname, salt)
{
    verify_promise = crypto.subtle.verify(
      {
        name: algname,
        saltLength: salt
      },
      read_public_key,
      read_signature,
      stringToArrayBufferView(mess));

    verify_promise.then(
        function(result){
            console.log(result);//true or false
            last_verification = result;
        },
        function(e){
            console.log(e.message);
        })
}


function import_key_verify(key_jwk_format, mess, read_signature, algname, hashname, salt) {
  key_json = JSON.parse(key_jwk_format);
  import_promise = window.crypto.subtle.importKey('jwk',
            key_json,
            {name: algname, hash: {name: hashname}},
            true,
            ['verify']);

  import_promise.then(
    function(result) {
      console.log('Key imported successfully');
      console.log('public key: ', result);
      read_public_key = result;
      verify_data(mess, read_signature, algname, hashname, salt)

    },
    function(e){
      console.log(e);
    }
  )
}


function show_public_key(elemID, key_form) {
  export_promise = crypto.subtle.exportKey(key_form, public_key_object);
  return export_promise.then(
    function(result) {
      //console.log("result of exporting key: ", result)
      document.getElementById(elemID).innerHTML += "</br></br>Public key in Json Web Key (JWK) Format: </br></br> " + JSON.stringify(result) + "</br></br>";
    },
    function(e){
      console.log(e.message)
    })
}


function show_public_key_alert(key_form) {
  export_promise = crypto.subtle.exportKey(key_form, public_key_object);
  return export_promise.then(
    function(result) {
      //console.log("result of exporting key: ", result)
      alert("Public key in JSON WEB KEY format (JWK): \n\n " + JSON.stringify(result));
    },
    function(e){
      console.log(e.message)
    })
}

function show_private_key_alert() {
  export_promise = crypto.subtle.exportKey('jwk', private_key_object);
  return export_promise.then(
    function(result) {
      //console.log("result of exporting key: ", result)
      alert("Private key in JSON WEB KEY format (JWK): \n\n " + JSON.stringify(result));
    },
    function(e){
      console.log(e.message)
    })
}

function show_signature() {
    alert("The resulting signature:\n\n" +  buf2hex(signature))
}



//from GitHub
//https://gist.github.com/Glamdring/04eacabae3188dd5978241183b4d4bc5
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


//from GitHub
//https://gist.github.com/Glamdring/04eacabae3188dd5978241183b4d4bc5
function hex2buf(hex) {
	var buffer = new ArrayBuffer(hex.length / 2);
	var array = new Uint8Array(buffer);
	var k = 0;
	for (var i = 0; i < hex.length; i +=2 ) {
		array[k] = parseInt(hex[i] + hex[i+1], 16);
		k++;
	}

	return buffer;
}
