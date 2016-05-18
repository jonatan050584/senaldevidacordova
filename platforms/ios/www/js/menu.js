var Menu = function(){
	this.dom = $("#menu");
	if(usuario.pic!=null) $("#menu .pic").css("background-image",'url("'+usuario.pic+'")')
	$("#menu .nombre").html(usuario.nombres+" "+usuario.apellidos);



	this.mostrar = function(){
		$("#header .back").hide();
		$("#header").hide();

		if(usuario.notificaciones!=null){
			var cant = usuario.notificaciones.length;
			
			if(cant>0){
				$("#menu .invitaciones .cant").html(cant);
				$("#menu .invitaciones .cant").show();
			}else{
				$("#menu .invitaciones .cant").hide();
			}
		}else{
			$("#menu .invitaciones .cant").hide();
		}

		Menu.prototype.mostrar.call(this);
	}
	this.ocultar = function(){
		$("#header").show();
		Menu.prototype.ocultar.call(this);	
	}
	new Boton($("#menu .btn.cerrar"),function(){
		history.back();
	});

	new Boton($("#menu .salir"),function(){
		new Alerta("¿Desea cerrar sesión?","Salir",function(){
			new Espera("Cerrando sesión...");
			usuario.cerrarSesion();
		})
	});
	new Boton($("#menu .migrupo"),function(){
		getContent({page:"internagrupo"},true);
	});

	new Boton($("#menu .invitaciones"),function(){
		getContent({page:"invitaciones"},true)
	})
	new Boton($("#menu .sobre"),function(){
		getContent({page:"sobre"},true)
	})
}
Menu.prototype = new Seccion();