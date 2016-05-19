var Internagrupo = function(){
	this.dom = $("#internagrupo");
	this.titulo = "Contactos";
	this.id = null;
	this.miembros = new Array();
	this.nombre = null;
	this.admin = false;
	/*
	new Boton($("#internagrupo .btn.ubicacion"),function(){
		getContent({page:"ubicacion"},true);
	});*/
	
	
	new Boton($("#internagrupo .bt.crear"),function(){
		//getContent({page:"contactos"},true);
		new Request("grupo/crear",{
			admin:usuario.llave
		},function(infogrupo){
			usuario.setGrupo(infogrupo);
			//getContent({page:"contactos"},true);
			internagrupo.mostrar();
		})
	})

	new Boton($("#internagrupo .bt.salir"),function(){
		var msg;
		if(internagrupo.admin){
			msg = "Eres administrador de este grupo. Si lo abandonas el grupo seguirá existiendo y se nombrará un administrador al azar.";
		}else{
			msg = "¿Deseas abandonar este grupo?"
		}
		new Alerta(msg,"Abandonar",function(){
			new Request("grupo/abandonar",{
				usuario:usuario.id,
				grupo:usuario.grupo.id,
				admin:internagrupo.admin
			},function(res){
				$("#internagrupo .lista .miembros").empty();
				$("#internagrupo .lista .pendientes").empty();
				if(usuario.invitaciones!=null){
					$.each(usuario.invitaciones,function(k,v){
						var id = v.id;
						socket.emit("directo",{ac:"invitacion",id:id});

					})
				}
				if(usuario.miembros!=null){
					$.each(usuario.miembros,function(k,v){
						var id = v.id;
						socket.emit("directo",{ac:"abandonagrupo",id:id});
					})
				}

				new Request("usuario/info",{
                    key:usuario.llave
                },function(response){
                    
                    usuario.iniciar(response);    
                })
				

			})
		});

	})
	
	

	this.mostrar = function(){
		console.log("mostraaaaaar");
		
		
		//contactos.flag=false;

		//this.listarcontactos(id);
		

		if(usuario.grupo==null){
			header.mostrar("menu");
			$("#internagrupo").addClass("singrupo");
		}else{
			console.log("vaaaa");

			if(usuario.miembros!=null){
				$.each(usuario.miembros,function(k,v){
					if((v.id == usuario.id) && v.admin==1){
						internagrupo.admin=true;
					}
				});
			}

			if(internagrupo.admin){
				header.mostrar("menu,addcontact");
			}else{
				header.mostrar("menu");
			}
			
			$("#internagrupo").removeClass("singrupo");
			this.listarpendientes();
			this.listarmiembros();
		}

		Internagrupo.prototype.mostrar.call(this);

	}

	this.listarpendientes = function(){

		

		if(online){
			new Request("grupo/listarinvitaciones",{
				grupo:usuario.grupo.id
			},function(res){
				//console.log(res);
				usuario.setInvitaciones(res);
			})
		}else{
			this.llenarListaPendientes();
		}
	}

	this.listarmiembros = function(){
		
		if(online){
			new Request("grupo/listarmiembros",{
				grupo:usuario.grupo.id
			},function(res){
				//console.log(res);
				usuario.setMiembros(res);


				$.each(usuario.miembros,function(k,v){
					if((v.id == usuario.id) && v.admin==1){
						internagrupo.admin=true;
						header.mostrar("menu,addcontact");
					}
				});
				
			})
		}else{
			this.llenarListaMiembros();
		}
	}

	this.llenarListaMiembros = function(){
		$("#internagrupo .lista .miembros").empty();
		contactos.total = 0;
		if(usuario.miembros!=null){
			$.each(usuario.miembros,function(key,val){
				contactos.total++;
				var it = new ItemMiembro(val);
				$("#internagrupo .lista .miembros").append(it.html);
			})	
		}
	}
	this.llenarListaPendientes = function(){
		$("#internagrupo .lista .pendientes").empty();
		if(usuario.invitaciones!=null){
			$.each(usuario.invitaciones,function(key,val){
				var it = new ItemMiembro(val,"pendiente");
				$("#internagrupo .lista .pendientes").append(it.html);
			})	
		}
	}

	this.seleccionarContacto = function(info){
		console.log("picnic 0");
		console.log(info);

		
		if(info.phoneNumbers!=null && (info.displayName!=null || info.name.formatted!="")){
			console.log("picnic 1");
			var numeros = new Array();

			$.each(info.phoneNumbers,function(k,v){

				var tel = v.value;

				tel = tel.replace(/\D/g,'')

				tel = tel.substr(-9);
				//tel = tel.replace(/ /g,""); //elimina espacios

				if(tel.substr(0,1)=="9"){
					numeros.push(tel);
				}

			});

			console.log("picnic 2");


			if(numeros.length>0){

				/*var foto = null;
				if(info.photos!=null){
					foto = info.photos[0].value;
				}*/

				var nombre = info.displayName;
				if(nombre==null) nombre = info.name.formatted;
				
				

				/*if(foto!=null){
					$("#contacto .pic").attr("src",foto);
				}else{
					$("#contacto .pic").attr("src","img/user.png");
				}*/
				$("#contacto .pic").attr("src","img/user.png");
				$("#contacto .nombre").html(nombre);
				$("#contacto .numero .telefono").html("");
				
				if(numeros.length>1){
					console.log("picnic 3");
					$("#contacto .seleccione").show();
					$("#contacto .lista").empty();
					$.each(numeros,function(k,v){
						var html = $('<div class="item">'+v+'</div>');
						$("#contacto .lista").append(html);
						new Boton(html,function(){
							$("#contacto").hide();
							$("#contacto .seleccione").hide();
							internagrupo.validarexiste(v,nombre);
							new Espera("Validando...");
						});

					});

					console.log("picnic 4");
					$("#contacto .noapp").hide();
					$("#contacto .siapp").hide();

					$("#contacto").show();


				    $("#contacto").transition({opacity:0},0);
				    
				    $("#contacto").transition({opacity:1,complete:function(){
				       // $("#alerta").show();

				    }});
				}else{
					
					console.log("picnic 5");
					internagrupo.validarexiste(numeros[0],nombre);
					console.log("picnic 6");
				}

				

			}else{
				new Alerta("El contacto seleccionado no cuenta con número de celular");
			}
		}else{

			new Alerta("El contacto seleccionado no tiene información completa");

		}


		


	}

	this.validarexiste = function(tel,nombre){

		//console.log(usuario.invitaciones);
		
		var yaesta = false;
		$.each(usuario.invitaciones,function(k,v){

			if(v.telefono == tel || v.itelefono == tel){
				yaesta=true;
			}
		});

		$.each(usuario.miembros,function(k,v){
			if(v.telefono == tel || v.itelefono == tel){
				yaesta=true;
			}
		});

		

		if(!yaesta){
			new Request("usuario/validarexiste",{
				tel:tel
			},function(res){
				//$("#espera").show();
				if(res.info==null){
					$("#contacto .numero .telefono").html(tel);
					$("#contacto .siapp").hide();
					$("#contacto .noapp").show();
					$("#contacto .noapp .nom").html(nombre);
					new Boton($("#contacto .noapp .bt.invitar"),function(){
						$("#contacto").hide();
						
						new Request("grupo/invitarmiembro",{
							tel:tel,
							nom:nombre,
							admin:usuario.llave
						},function(){
							internagrupo.mostrar();
							$.each(usuario.miembros,function(k,v){
								socket.emit("directo",{ac:"nuevoinvitado",id:v.id});
							});
							
						})

						window.plugins.socialsharing.shareViaSMS('Instala Señal de Vida en tu smartphone y mantengámonos conectados en caso de Sismo. Visita http://picnic.pe/lifesignal/ para descargarlo',tel,function(msg){
							
						},function(msg) {
							alert('error: ' + msg);
						});
						
					});
				}else{
					$("#contacto .siapp").show();
					$("#contacto .noapp").hide();
					if(res.info.pic!=null){
						$("#contacto .pic").attr("src",res.info.pic);
					}
					$("#contacto .nombre").html(res.info.nombres+" "+res.info.apellidos);
					$("#contacto .numero .telefono").html(res.info.telefono);

					new Boton($("#contacto .siapp .bt.agregar"),function(){
						$("#contacto").hide();

						new Request("grupo/agregarmiembro",{
							admin:usuario.llave,
							tel:res.info.telefono
						},function(){
							internagrupo.mostrar();
							$.each(usuario.miembros,function(k,v){
								socket.emit("directo",{ac:"nuevoinvitado",id:v.id});
							});
							socket.emit("directo",{ac:"invitacion",id:res.info.id});
						})
					});

				}

				
				setTimeout(function(){
					$("#contacto").show();


				    $("#contacto").transition({opacity:0},0);
				    
				    $("#contacto").transition({opacity:1,complete:function(){
				       // $("#alerta").show();

				    }});
				   $("#espera").transition({opacity:0,complete:function(){
			      
				       $("#espera").hide();
				       $("#espera").css("opacity",1);
				       
				    }});
				},1000);
			    
				
				


			},{
				espera:"Validando..."
			})
		}else{

			setTimeout(function(){
				$("#espera").transition({opacity:0,complete:function(){
				      
			       $("#espera").hide();
			       $("#espera").css("opacity",1);
			       
			    }});
				new Alerta("Ese número ya pertenece a tu grupo o está pendiente de aceptación");
			},1000);
		}
	}
	

}
Internagrupo.prototype = new Seccion();

var ItemMiembro = function(d,estado){
	//internagrupo.miembros.push(d);
	console.log(d);

	var nombres = d.nombres+' '+d.apellidos;
	var telefono = d.telefono;
	if(d.invitado==null && estado=="pendiente"){
		nombres = d.inombres;
		telefono = d.itelefono;
	}
	
	this.html = $(lib.ItemMiembro);
	if(estado!=undefined) this.html.addClass(estado);
	this.html.find('.nom').html(nombres);
	

	if(d.pic!=null){
		this.html.find('.pic').css("background-image","url('"+d.pic+"')");
	}
	if(d.admin==1){
		this.html.addClass("ad");
	}

	//

	new Boton(this.html,function(){
		if(d.pic == null) d.pic = "img/user.png";
		var html = '<img src="'+d.pic+'" width="100" height="100" style="margin:auto;border-radius:50px;display:block;margin-bottom:20px">'+
								nombres+'<br>'+telefono;
		new Alerta(html,"LLamar",function(){
			window.open("tel:"+telefono, '_system');
			$("#alerta").show();
		});
	});

}