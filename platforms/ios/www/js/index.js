var production = true;
var pathapi;
var login;
var usuario;
var seccion = "home";
var facebook;
var ubicacion;
var grupos;
var header;
var internagrupo;
var contactos;
var invitaciones;
var registro;
var menu;
var sobre;

var bd;

var appkey = "miclave";

var socket;

var flaglogin=false;

var w; //ancho de pantalla
var h; //alto de pantalla

var terremoto = false;

var version = "1.0.2";

if(production){
    //pathapi = "http://picnic.pe/clientes/bancofalabella/RESTAPI/";
   //pathapi = 'http://192.168.0.16/lifesignal/api/';
    pathapi = "http://picnic.pe/clientes/lifesignal/api2/";
}else{
    //pathapi = 'http://52.34.151.159/RESTAPI/';
    pathapi = "http://localhost/lifesignal/api/";
    //pathapi = 'http://localhost/lifesignal/Life-Signal-Api/';
}

var home;
var usuario;
var initTime=1000;

var online =false;

var flaginit=false;

var app = {
    
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        if(production){
            document.addEventListener('deviceready', this.onDeviceReady, false);
            document.addEventListener("resume", this.onDeviceResume);
            document.addEventListener("pause",this.onDevicePause);
            document.addEventListener("offline", function(){
               // console.log("offline");
                online=false;   
               
                
            }, false);
            document.addEventListener("online",function(){
                //console.log("online");
                online=true;
                
            })
        }else{
            online=true;
            $(document).ready(this.onDeviceReady);
        }
    },
    
    onDeviceResume: function(){
        //alert(1);
        //backgroundGeoLocation.stop()
        
        //comprobarVersion();
        
    },
    onDevicePause:function(){


        /*
        var callbackFn = function(location) {
            console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);

            socket.emit('enviarposicion',{
                id:usuario.id,
                lat:location.latitude,
                lon:location.longitude,
                from:'background'
            });
            backgroundGeoLocation.finish();


        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        };

        // BackgroundGeoLocation is highly configurable. See platform specific configuration options
        backgroundGeoLocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        backgroundGeoLocation.start();
        */
    },

    onDeviceReady: function() {
        w = $(window).innerWidth();
        h = $(window).innerHeight();

        new Boton($("#contacto .cerrar"),function(){
            $("#contacto").hide();
        });

        comprobarVersion();
        /*
        var push = PushNotification.init({
            android: {
                senderID: "1029590604378"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });

        push.on('registration', function(data) {
            // data.registrationId
            console.log(data);
        });

        push.on('notification', function(data) {
            console.log(data);
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            console.log(e);
            // e.message
        });
    
        */
        console.log("device ready");

        
        header = new Header();

        facebook = new Facebook();

        home = new Home();

        if(!production){
            setTimeout(function(){
                facebook.init();
            },2000);
            initTime = 4000;
        }

        if(window.localStorage.getItem("usuario")==null){
            window.localStorage.clear();
            console.log("no sesion");
            $("#home").show();
        }else{
            console.log("sesion activa");
            usuario = new Usuario();

            var data = {
                info: JSON.parse(window.localStorage.getItem("usuario")),
                grupo: JSON.parse(window.localStorage.getItem("grupo")),
                invitaciones: JSON.parse(window.localStorage.getItem("invitaciones")),
                notificaciones: JSON.parse(window.localStorage.getItem("notificaciones")),
                miembros: JSON.parse(window.localStorage.getItem("miembros"))
            }
            
            if((production && online) || !production){

                new Request("usuario/info",{
                    key:data.info.llave
                },function(res){
                    data = res;
                    usuario.iniciar(data);    
                },{
                    error:function(){
                        usuario.iniciar(data);
                    }
                })

            }else{
                usuario.iniciar(data);    
            }


            
        }

        
        
        w = $(window).innerWidth();
        h = $(window).innerHeight();
        //login = new Login();
        
        registro = new Registro();
        

        
    }
};


function comprobarVersion(){
    
    $.ajax({
        url:pathapi+"sistema/version",
        dataType:"json",
        data:{
            version:version
        },
        type:'get',
        success:function(res){
            if(res["res"]=="menor"){
                new Alerta(res["msg"],res["btn"],function(){
                    window.open(res["link"],"_system");
                    $("#alerta").show();
                })
            }
        }
        
    });
    
}

var Boton = function(dom,callback){
    var flagtouch=false;
    dom.unbind();
    if(production){
        dom.on({
            "touchstart":function(){
                flagtouch=true;
                $(this).addClass("over");
            },
            "touchmove":function(){

                flagtouch=false;
            },
            "touchend":function(){
                if(flagtouch){
                   

                    callback($(this));
                }
                 $(this).removeClass("over");

            }
        });
       

    }else{
        dom.bind({
            "mousedown":function(){
                $(this).addClass("over");
            },
            "mouseup":function(){
                $(this).removeClass("over");
                callback($(this));
            }
        });
    }

};






var Request = function(ac,params,callback,options){
    var msg = "Procesando...";

    if(options!=undefined && options.espera!=undefined){

        msg = options.espera;
    }

   //var es = new Espera(msg);

    $.ajax({
        url:pathapi+ac,
        dataType:"json",
        data:params,
        type:'get',
        cache:false,
        timeout:20*1000,
        success:function(res){
            //console.log(res);
           // es.fin();
            callback(res);
        },
        error: function(x, t, m) {
            
           // console.log(x);
            //console.log(t);
            //console.log(m);

            //es.fin();

            new Alerta("Ocurrió algún tipo de error.<br>Comprueba tu conexión de red o inténtalo de nuevo más tarde.");
            if(options!=undefined){
                if(options.error!=undefined){
                    options.error();
                }
            }
        }
    });
}


window.onpopstate = function(event) {

   
    getContent(event.state,false);
   

    

};


function getContent(obj,addEntry){
    
    if(obj==null){
        obj = new Object({page:"home"});
    }

    var antseccion = seccion;
    seccion=obj.page;

    //console.log(window[antseccion]);

   
    //if(antseccion!=""){
        //if(seccion=="home"){
            //if(!flaglogin) window[antseccion].ocultar();    
        //}else{
    window[antseccion].ocultar();    
        //}
        
    //}
       
    switch(seccion){
        case "home":
            if(!flaglogin){
                $("#header").hide();
                home.mostrar();
            }
            break;
        case "internagrupo":
            internagrupo.mostrar(obj.grupo,obj.nombre);
            
            break;
        case "ubicacion":
            if(terremoto==false){
                history.back();
            }
            ubicacion.mostrar();
            ubicacion.iniciarMapa();
            break;
        default:
            window[seccion].mostrar();

       
    }

    

    //if(menu.abierto) menu.cerrar();

    


   
   
    

    

    //window[antseccion].ocultar();
    //window[seccion].mostrar();

    if(addEntry == true) {
        history.pushState(obj,null); 
    }

    //window.scrollTo(0,0);

    
    


}

var Seccion = function(){

    this.mostrar = function(){
        this.dom.css('display',"block");
        this.dom.transition({opacity:0},0);
        this.dom.transition({opacity:1});

        //header.setTitulo(this.titulo);

        //this.dom.show();
    }

    this.ocultar = function(){
        this.dom.hide();
    }
}


var Espera = function(msg,callback){

    $("#espera .txt").html(msg);
    $("#espera").show();
    this.fin = function(){
        $("#espera .txt").html("");
        $("#espera").hide();
    }

    this.txt = function(val){
        $("#espera .txt").html(val);
    }
}


var Alerta = function(msg,btn,callback,noclose){

    if(noclose!=undefined && noclose==true){
        $("#alerta .cerrar").hide();
    }else{
        $("#alerta .cerrar").show();
    }

    $("#alerta .txt").html(msg);

    if(btn!=undefined){
        $("#alerta .bt").html(btn);
    }else{
        $("#alerta .bt").html("OK");
    }


    //$("#cubre").show();
    //$("#alerta").show();

    
    $("#cubre").show();
    $("#cubre").transition({opacity:0},0);
    $("#cubre").transition({opacity:1,complete:function(){
        //$("#cubre").show();
    }});

    $("#alerta").show();
    $("#alerta").transition({opacity:0},0);
    

    var vh = $("#alerta").outerHeight();

    //$("#alerta").css("top",(h-vh)/2);

    $("#alerta").transition({opacity:1,complete:function(){
       // $("#alerta").show();
    }});

    $("#alerta .bt.ok").unbind();

    new Boton($("#alerta .cerrar"),function(){
        $("#alerta").hide();
        $("#cubre").hide();

    });

    $("#alerta .bt.ok").unbind();
    new Boton($("#alerta .bt.ok"),function(){
        $("#alerta").hide();
        $("#cubre").hide();
        if(callback!=undefined){
            
            callback();
        }
    });
}



