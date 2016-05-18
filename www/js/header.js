var permissions;
var Header = function(){

	new Boton($("#header .btn.menu"),function(){
		getContent({page:"menu"},true);
	});

	this.mostrar = function(botones,titulo){
		$("#header").show();
		$("#header .btn").hide();
		if(botones!=undefined){
			var btns = botones.split(",");
			$.each(btns,function(k,v){
				$("#header .btn."+v).show();
			})
		}
		if(titulo!=undefined){
			$("#header .titulo").html(titulo);
			$("#header").addClass("nologo");
		}else{
			$("#header .titulo").html("");
			$("#header").removeClass("nologo");
		}
		

	}

	this.setButton = function(nom,callback){
		$("#header .btn."+nom).unbind();
		new Boton($("#header .btn."+nom),callback);
	}



	this.mostrarNotificaciones = function(){
		var cant = 0;
		if(usuario.notificaciones!=null) cant = usuario.notificaciones.length;
		if(cant>0){
			$("#header .btn.menu .inv").html(cant);
			
			$("#header .btn.menu .inv").show();
		}else{
			$("#header .btn.menu .inv").hide();
		}
	}

	new Boton($("#header .logout"),function(){
		usuario.cerrarSesion();
	});

	new Boton($("#header .invitations"),function(){
		getContent({page:"invitaciones"},true);
	});
	new Boton($("#header .back"),function(){
		//alert(1);
		history.back();
	});

	new Boton($("#header .btn.add"),function(){

		

		grupos.crear();

		

	});

	new Boton($("#header .btn.addcontact"),function(){

		
		var total = usuario.invitaciones.length + usuario.miembros.length;
		
		if(total<10){

			//getContent({page:"contactos"},true);
			if(production){
				console.log("aca");
				

				permissions = window.plugins.permissions;
				permissions.hasPermission(checkPermissionCallback, null, permissions.READ_CONTACTS);
				 
				

				console.log("hola");


				

				
							
			}else{
				$.ajax({
					url:'contacto.json',
					dataType:'json'
				}).done(function(json){
					internagrupo.seleccionarContacto(json);	
				})
				
			}
		}
	});


	
}

function checkPermissionCallback(status) {
  if(!status.hasPermission) {
    var errorCallback = function() {
      console.warn('Camera permission is not turned on');
    }
 
    permissions.requestPermission(function(status) {
      if( !status.hasPermission ){
      	errorCallback();
      }else{
      	

    	listarContactos();
      }
    }, errorCallback, permissions.READ_CONTACTS);
  }else{

  	listarContactos();
  }
}

function listarContactos(){
	navigator.contacts.pickContact(function(contact){
	        //console.log('The following contact has been selected:' + JSON.stringify(contact));
	        internagrupo.seleccionarContacto(contact);
    },function(err){
        console.log('Error: ' + err);
    });


    var options      = new ContactFindOptions();
	options.filter   = "";
	options.multiple = true;
	
	navigator.contacts.find(['displayName', 'name','phoneNumbers'], function(res){
		console.log(res);
	}, function(e){
		//console.log(error);
	}, options);
}