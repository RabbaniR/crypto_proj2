require(['webcrypto_api_sign']);

var algname = null;
var hashname = null;
var saltlen = null;
var modlen = null;

$(document).ready(function(){
    $(".panel").show();
    $("input:radio[name='alg-selection']").click(function(){
        algname = $("input:radio[name='alg-selection']:checked").val();
        document.getElementById("log").innerHTML += "</br>Selected signing algorithm: " + algname;
        if(algname == "RSA-PSS") {
            inputpanel_instr = document.getElementsByClassName("form-control")[0];
            //console.log("Element selected: ", inputpanel)
            inputpanel_instr.placeholder = "Enter a message to be signed using the RSA-PSS algorithm";
        }

        else if (algname == "RSASSA-PKCS1") {
            $(".panel").show();
            inputpanel_instr = document.getElementsByClassName("form-control")[0];
            inputpanel_instr.placeholder = "Enter a message to be signed using the RSASSA-PKCS1 algorithm";
        }
        else {
            //$(".panel").hide();
            $("."+algname).show();
        }

    });

    $("input:radio[name='hash-selection']").click(function() {
        hashname =  $("input:radio[name='hash-selection']:checked").val();
        document.getElementById("log").innerHTML += "</br>Selected hashing function is: " + hashname;

    })

    $("input:radio[name='mod-selection']").click(function() {
        modlen =  $("input:radio[name='mod-selection']:checked").val();
        document.getElementById("log").innerHTML += "</br>Selected length for the modulus is: " + modlen;

    })


    $("input:radio[name='salt-selection']").click(function() {
        saltlen =  $("input:radio[name='salt-selection']:checked").val();
        document.getElementById("log").innerHTML += "</br>Selected length for the salt: " + saltlen;

    })

    $("#sign-button").click(function() {
        mess = document.getElementById("alice-input").value;
        document.getElementById("log").innerHTML += "</br></br>Message submitted for hashing. ";
        document.getElementById("log").innerHTML += "</br>size of the message: " + mess.length + " characters.";
        //reading the parameters again in case the user didn't click on them
        algname = $("input:radio[name='alg-selection']:checked").val();
        hashname =  $("input:radio[name='hash-selection']:checked").val();
        modlen =  $("input:radio[name='mod-selection']:checked").val();
        saltlen =  $("input:radio[name='salt-selection']:checked").val();
        gen_key_sign(algname, hashname, modlen, saltlen, mess)
        setTimeout(function(){
              show_public_key('log', 'jwk');
              document.getElementById("bob-output").value = mess
              document.getElementById('log').innerHTML += "</br>Private and Public keys generated."
        }, 2000)
      })

    $("#verify-button").click(function() {
        mess_to_verify = document.getElementById("bob-output").value;
        var read_signature_hex = document.getElementById('bob-signature').value;
        var read_signature_buffer  = hex2buf(read_signature_hex);
        var read_public_key = document.getElementById('bob-publickey').value;
        console.log("Will now verify the authenticity of the following message: ", mess_to_verify)
        console.log("result of JSON parse: ", JSON.parse(read_public_key));
        console.log("Algname: ", algname, "Hashname: ", hashname)
        import_key_verify(read_public_key, mess_to_verify, read_signature_buffer, algname, hashname,  saltlen)
        setTimeout(function(){
          document.getElementById('log').value += "</br></br>Authetication Attempt finished. Result of authetication: ", last_verification;
          if(last_verification) {
            alert("Message is authentic!")
          }
          else {
            alert("Message is NOT authetic!")
          }
        }, 2000);
      })

    $("#publickey-button").click(function() {
      show_public_key_alert('jwk');
    })

    $("#privatekey-button").click(function() {
      show_private_key_alert('jwk');
    })

    $("#show-signature-button").click(function() {
      show_signature();
    })
});
