var Invitaciones = function(){
	this.dom = $("#invitaciones");
	

	this.mostrar = function(){
		
		header.mostrar("back");

		if(usuario.notificaciones!=null) this.listar();
		else{
			$("#invitaciones .lista").html('<div class="nohay">No tienes ninguna invitación pendiente.</div>');
		}
		this.revisarNuevas();
		Invitaciones.prototype.mostrar.call(this);
	}

	this.listar = function(){
		$("#invitaciones .lista").empty();

		var lista = usuario.notificaciones;
		
		$.each(lista,function(key,val){
			var it =  new ItemInvitacion(val);
			$("#invitaciones .lista").append(it.html);
		})
		
	}
	this.revisarNuevas = function(){
		new Request("usuario/buscarinvitaciones",{
			llave:usuario.llave
		},function(res){
//			console.log(res);
			if(res.length>0){
				usuario.setNotificaciones(res);
			}else{
				usuario.setNotificaciones(null);
			}
			
		},{
			espera:null
		})
	}
}

Invitaciones.prototype = new Seccion();

var ItemInvitacion = function(d){
	console.log(d);
	this.html = $(lib.ItemInvitacion);
	
	this.html.find(".usuario").html(d.nombres+" "+d.apellidos);

	if(d.pic!=null){
		this.html.find('.pic').css("background-image","url('"+d.pic+"')");
	}

	new Boton(this.html.find(".bt.aceptar"),function(e){
		console.log(usuario);
		new Alerta("Si ya perteneces a un grupo, dejarás de formar parte de él y pasarás a formar parte del nuevo grupo.<br><br>¿Deseas aceptar la invitación de "+d.nombres+"?","Aceptar",function(){
			var antgrupo = null;
			if(usuario.grupo!=null) antgrupo = usuario.grupo.id;
			new Request("grupo/aceptarinvitacion",{
				tel:usuario.telefono,
				grupo:d.grupo_id,
				antgrupo:antgrupo,
				admin:internagrupo.admin
			},function(res){
				if(usuario.miembros!=null){
					$.each(usuario.miembros,function(k,v){
						socket.emit("directo",{ac:"abandonagrupo",id:v.id});	
					})
				}
				

				usuario.setNotificaciones(null);


				usuario.setGrupo(res.grupo);
				usuario.setMiembros(res.miembros);
				
				$.each(usuario.miembros,function(k,v){
					socket.emit("directo",{ac:"invitacionrespondida",id:v.id});	
				})
				

				getContent({page:"internagrupo"},true);
				/*socket.emit("aceptarinvitacion",{
					usuario:d.usuario_id,
					grupo:d.grupo_id
				});*/

			},{
				espera:"Enviando respuesta..."
			});

		})

		

	});
	new Boton(this.html.find(".bt.rechazar"),function(e){
		
		new Request("grupo/rechazarinvitacion",{
			id:usuario.id,
			grupo:d.grupo_id
		},function(res){

			new Request("usuario/buscarinvitaciones",{
				llave:usuario.llave
			},function(res){
				
				if(res.length>0){
					usuario.setNotificaciones(res);
				}else{
					usuario.setNotificaciones(null);
				}
				invitaciones.mostrar();	
			},{
				espera:null
			})

			$.each(res.miembros,function(k,v){
				socket.emit("directo",{ac:"invitacionrespondida",id:v.id});
			})
			
		});

	});
}