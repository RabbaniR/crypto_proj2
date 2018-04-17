$(document).ready(function(){
    //display panels based on selected security level
    $(".dropdown-menu li a").click(function(){
        var securitySel = $(this).attr('data-value');
        if(securitySel == "all") {
            //show all
            $(".panel").show();
        }
        else {
            $(".panel").hide();
            $("."+securitySel).show(); 
        }
        
    });
    
});