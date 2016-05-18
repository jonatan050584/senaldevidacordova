var Usuario = function(){
    this.grupo = null
    this.invitaciones = null;

    this.iniciar = function(data){

        var info = data.info;

        this.id = info.id;
        this.nombres = info.nombres;
        this.apellidos = info.apellidos;
        this.email = info.email;
        this.telefono = info.telefono;
        this.llave = info.llave;
        this.fbid = info.fbid;
        this.pic = info.pic;


        window.localStorage.setItem("usuario",JSON.stringify(info));
        window.localStorage.setItem("notificaciones",JSON.stringify(data.notificaciones));
        window.localStorage.setItem("grupo",JSON.stringify(data.grupo));
        window.localStorage.setItem("invitaciones",JSON.stringify(data.invitaciones));
        window.localStorage.setItem("miembros",JSON.stringify(data.miembros));
        


        flaglogin=true;


        if(production) socket = io.connect('http://picnic.pe:8883');
        else socket = io.connect('http://localhost:8883');

        socket.on("connect", function() {
            //alert("conectado");
            console.log("usuario conectado al servidor");
            
            socket.emit('check in',{id:usuario.id});

            /*var opciones = {
                maximumAge: 15000,
                enableHighAccuracy:true,

            };
            navigator.geolocation.watchPosition(function(position){
                
                socket.emit('enviarposicion',{
                    id:usuario.id,
                    lat:position.coords.latitude,
                    lon:position.coords.longitude,
                    from:'foreground'
                });

            },function(e){
                console.log('error watchposition: '+e);
            },opciones);*/


            
        });

        socket.on("directo",function(data){
            switch(data.ac){
                case "invitacion":
                    invitaciones.revisarNuevas();
                    break;
                case "nuevoinvitado":
                    internagrupo.listarpendientes();
                    break;
                case "invitacionrespondida":
                    internagrupo.listarpendientes();
                    internagrupo.listarmiembros();
                    break;
                case "abandonagrupo":
                    internagrupo.listarmiembros();
                    internagrupo.listarpendientes();
                    break;

            }
            
        })

        /*socket.on("posicion",function(data){
            console.log(data);
            ubicacion.onPosiciones(data);
        });
        socket.on("mensaje",function(data){
            console.log(data);
        });

        
        socket.on("estadoterremoto",function(valor){
            terremoto=valor;
            if(valor){
                new Alerta("Terremoto de 7.6<br>Epicentro: Cañete<br>¡Ubica a tus contactos ahora!");
                $("#internagrupo .btn.ubicacion").show();
                $("#internagrupo").css("padding-top",85);
            }
        });

        socket.on("hayterremoto",function(){
            terremoto=true;
            new Alerta("Terremoto de 7.6 - Epicentro Cañete<br>¡Ubica a tus contactos ahora!");
            $("#internagrupo .btn.ubicacion").show();
             $("#internagrupo").css("padding-top",85);
        });



        socket.on("acaboterremoto",function(){
            terremoto=false;
            console.log("acabo");
            $("#internagrupo .btn.ubicacion").hide();
            $("#internagrupo").css("padding-top",50);
            if(seccion=="ubicacion"){
                getContent({page:"grupos"},false);
            }
        });

        socket.on("enviarinvitacion",function(invitado){
            if(usuario.id == invitado){
                header.cargarInvitaciones();
            }
        });

        socket.on('aceptarinvitacion',function(data){
            if(data.usuario==usuario.id){
                grupos.listar();    
            }
            if(seccion=="internagrupo" && internagrupo.id == data.grupo){
                internagrupo.listarcontactos(data.grupo);
            }
        });
        socket.on("mensaje",function(data){
            
        });
        */


        
        
        internagrupo = new Internagrupo();
        //ubicacion = new Ubicacion();
        contactos = new Contactos();
        invitaciones = new Invitaciones();
        sobre = new Sobre();
       
        /*
        $("#home").hide();
        $("#header").show();

        $("#menu .nombre").html(usuario.nombres+" "+usuario.apellidos);

        header.cargarInvitaciones();

        if(usuario.pic!=null){
            $("#menu .pic").css("background-image","url("+usuario.pic+")");
        }
        */

        if(window.localStorage.getItem("grupo")!=null){
            this.grupo = JSON.parse(window.localStorage.getItem("grupo"));
        }
        if(window.localStorage.getItem("invitaciones")!=null){
            this.invitaciones = JSON.parse(window.localStorage.getItem("invitaciones"));
        }
        if(window.localStorage.getItem("miembros")!=null){
            this.miembros = JSON.parse(window.localStorage.getItem("miembros"));
        }
        if(window.localStorage.getItem("notificaciones")!=null){
            this.notificaciones = JSON.parse(window.localStorage.getItem("notificaciones"));
        }

        menu =  new Menu();

        header.mostrarNotificaciones();
        
        getContent({page:"internagrupo"},true);

    }

    this.setGrupo = function(info){
        this.grupo = info;
        window.localStorage.setItem("grupo",JSON.stringify(info));

    }
    this.setMiembros = function(lista){
        this.miembros = lista;
        window.localStorage.setItem("miembros",JSON.stringify(lista));
        internagrupo.llenarListaMiembros();
    }
    this.setInvitaciones = function(lista){
        this.invitaciones = lista;
        window.localStorage.setItem("invitaciones",JSON.stringify(lista));

        internagrupo.llenarListaPendientes();

    }
    this.setNotificaciones = function(lista){
        this.notificaciones = lista;
       

        if(lista!=null)  window.localStorage.setItem("notificaciones",JSON.stringify(lista));
        else window.localStorage.setItem("notificaciones",null);
        header.mostrarNotificaciones();
    }

    this.cerrarSesion = function(){
       
        window.localStorage.removeItem("usuario");
        window.localStorage.removeItem("grupo");
        window.localStorage.removeItem("invitaciones");
        location.reload();
    }
    
}
