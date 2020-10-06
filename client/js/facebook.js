
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '629425321308895',
      cookie     : true,
      xfbml      : true,
      version    : 'v8.0', 
      oauth      : true
    });
      
    //FB.AppEvents.logPageView();   
    FB.Event.subscribe('auth.authResponseChange', function(response) {
        if (response.status === 'connected') {
        console.log("<br>Connected to Facebook");
        //SUCCESS
        FB.api('/me?fields=email,name', function(response){
            console.log(response.name);
            console.log(response.email);
            
            //window.location.href = "/socialogin"
            fetch("/socialogin", {
                method: 'POST',
                redirect: 'follow',
                async: false,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: response.name, email: response.email, type:'facebook-login'}),
                success: function (data, textStatus, jqXHR) {

                    location.replace("/");
                  
                }
            });
          }
        );

        }    
        else if (response.status === 'not_authorized'){
            console.log("Failed to Connect");
        } else {
            console.log("Logged Out");
        }
    }); 

      
  };


  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
