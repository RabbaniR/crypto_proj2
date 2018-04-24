require(['webcrypto_api_sign']);

var algname = null;
var hashname = null;
var saltlen = null;
var modlen = null;

$(document).ready(function(){
    $(".panel").show();
    $("#alg-selection li a").click(function(){
        algname = $(this).attr('data-value');
        console.log("Selected signing algorithm: ", algname);
        if(algname == "RSA-PSS") {
            inputpanel_instr = document.getElementsByClassName("form-control")[0];
            //console.log("Element selected: ", inputpanel)
            inputpanel_instr.placeholder = "Enter a message to be signed using the RSA-PSS algorithm";
        }

        else if (algname == "RSASSA-PKCS1-v1_5") {
            $(".panel").show();
            inputpanel_instr = document.getElementsByClassName("form-control")[0];
            inputpanel_instr.placeholder = "Enter a message to be signed using the RSASSA-PKCS1 algorithm";
        }
        else {
            //$(".panel").hide();
            $("."+algname).show();
        }

    });

    $("#hash-selection li a").click(function() {
        hashname =  $(this).attr('data-value');
        console.log("Selected hashing method is: ", hashname);
    })

    $("#modulus-selection li a").click(function() {
        modlen =  $(this).attr('data-value');
        console.log("Selected modulus length is: ", modlen);
    })


    $("#salt-selection li a").click(function() {
        saltlen =  $(this).attr('data-value');
        console.log("Selected salt length is: ", saltlen);
    })

    $("#sign-button").click(function() {
        mess = document.getElementById("alice-input").value;
        console.log("Value of alice message: ",  mess);
        if (algname == null || hashname == null || saltlen == null || modlen == null) {
          alert("Please select the algorithm, the hashing method, and the salt length");
        }
        else {
           gen_key_sign(algname, hashname, modlen, saltlen, mess)
           setTimeout(function(){
              document.getElementById("bob-output").value = mess
           }, 2000);
        }
    })

    $("#verify-button").click(function() {
        mess_to_verify = document.getElementById("bob-output").value;
        console.log("Will now verify the authenticity of the following message: ", mess_to_verify)
        verify_data(mess_to_verify, algname, saltlen)
        setTimeout(function(){
          console.log("Value of verification result is: ", last_verification);
          if(last_verification) {
            alert("Message is authentic!")
          }
          else {
            alert("Message is not authetic!")
          }
        }, 2000);
      })

});
