var Contactos = function(){
	this.dom = $("#contactos");

	this.flag=false;

	this.lista = new Array();

	var validos = new Array();

	this.invitados = new Array();

	this.total = 0;
	
	var timebus;

	new Boton($("#contactos .invitacion .cerrar"),function(){
		$("#contactos .invitacion").hide();
	});

	


	$("#contactos .busqueda input[name=buscar]").keyup(function(e){
		clearTimeout(timebus);
		var bus = $(this).val().toLowerCase();
		timebus = setTimeout(function(){
			
			$("#contactos .lista .item").each(function(index){
				var res=false;
				
				var num= $(this).find(".tel").html();

				if(num.substr(0,bus.length)==bus){
					res=true;
				}

				if(!res){
					var nom = $(this).find(".nom").html().toLowerCase();
					var palabra = nom.split(" ");
					
					$.each(palabra,function(k,v){
						if(v.substr(0,bus.length)==bus){
							res=true;
						}
					});
				}


				


				if(res){
					$(this).show();
				}else{
					$(this).hide();
				}

			})
		},1000);

		
	})

	this.mostrar = function(){

		this.invitados = new Array();

		header.mostrar("back",'Elegir contactos<br><span class="sub">'+this.total+' de 10</span>');

		//header.setButton("done",this.done);
		if(!this.flag){
			this.flag=true;
			this.listar();	
		}
		

		Contactos.prototype.mostrar.call(this);
	}
	this.done = function(){
		var inv = new Array();
		$("#contactos .lista .item").each(function(index){
			if($(this).hasClass("check")){
				inv.push($(this).data("id"));
			}
		});
		if(inv.length>0){
			if(usuario.grupo==null){
				new Request("grupo/crear",{
					llave:usuario.llave,
					invitados:inv.join(",")
				},function(res){
					
					$.each(inv,function(k,v){
						socket.emit("directo",{ac:"invitacion",id:v});
					});

					usuario.setGrupo(res.grupo);
					usuario.setInvitaciones(res.invitados);
					
					getContent({page:"internagrupo"},true);

				},{
					espera:"Creando grupo..."
				})
			}else{
				new Request("grupo/agregarmiembros",{
					usuario:usuario.id,
					grupo:usuario.grupo.id,
					invitados:inv.join(",")
				},function(res){
					$.each(inv,function(k,v){
						socket.emit("directo",{ac:"invitacion",id:v});
					});
					usuario.setInvitaciones(res.invitados);
					getContent({page:"internagrupo"},true);
				})
			}
		}

	
	}

	this.listar = function(){

		$("#contactos .lista").empty();

		var es = new Espera("Listando contactos...");

		if(production){

			var options      = new ContactFindOptions();
			options.filter   = "";
			options.multiple = true;
			
			navigator.contacts.find(['displayName', 'name','phoneNumbers'], this.onContacts, function(e){
				//console.log(error);
			}, options);
		}else{

			$.ajax({
				url:'contactos.json',
				dataType:'json'
			}).done(this.onContacts);

		}

			
		

	}	

	this.onContacts = function(res){
		
		var arrInvitaciones = new Array();

		$.each(usuario.invitaciones,function(k,v){
			arrInvitaciones.push(v.telefono);
		});

		$.each(res,function(key,val){
			var foto=null;
			

			if(val.photos!=null){
				

				foto = val.photos[0].value;
				
			}

			if(val.phoneNumbers!=null && (val.displayName!=null || val.name.formatted!="")){

				$.each(val.phoneNumbers,function(k,v){
					var tel = v.value;
					tel = tel.replace("+51","");
					tel = tel.replace(/ /g,"");
					

					if(tel.length==9 && tel.substr(0,1)!="0"){

						if(arrInvitaciones.indexOf(tel)==-1){
							var nom = val.displayName;
							if(nom==null) nom = val.name.formatted;


							var it = new ItemContacto({
								nombre: nom,
								telefono: tel,
								foto:foto,
								original:v.value
							});
							$("#contactos .lista").append(it.html);

						}

						

						

						
						
					}

				})

			}
		});
		$("#espera").hide();
	
	}

	



}
Contactos.prototype = new Seccion();


var ItemContacto = function(d){
	
	this.html = $(lib.ItemContacto);

	if(d.foto!=null){
		this.html.find(".pic").css("background-image",'url("'+d.foto+'")');
	}
	this.html.addClass("plus");
	
	
	this.html.find('.nom').html(d.nombre);
	this.html.find('.tel').html(d.telefono);

	

	new Boton(this.html,function(e){

		
		if(d.foto==null) d.foto = "img/user.png";

		var html = '<img src="'+d.foto+'" width="100" height="100" style="margin:auto;border-radius:50px;display:block;margin-bottom:10px">'+
								d.nombre+"<br><strong>"+d.telefono+'</strong><div class="mensaje"></div>';

		new Alerta(html,"Agregar a mi grupo",function(){
			$("#alerta").show();
			new Request("grupo/agregarmiembro",{
				tel:d.telefono,
				admin:usuario.llave
			},function(ret){
				if(ret.res=="no"){
					$("#alerta .mensaje").html('<br><span style="color:rgba(225,27,76,1)">'+ret.msg+'</span>');
					$("#alerta .bt.ok").html("Invitar por SMS");
					$("#alerta").show();
					$("#alerta .bt.ok").unbind();
					new Boton($("#alerta .bt.ok"),function(){
						/*window.plugins.socialsharing.shareViaSMS(ret.sms,d.original,function(msg){
							console.log("mensaje enviado: "+msg);
							new Request("grupo/invitarmiembro",{
								tel:d.telefono,
								admin:usuario.llave
							},function(res){
								new Alerta("Se envió la invitación a "+d.nombre+"<br>Cuando instale el app se le notificará que deseas agregarlo a tu grupo");
								e.remove();
							},{
								espera:"Guardando..."
							})
							
						
						},function(msg) {

							new Alerta("Ocurrió un error al enviar el SMS. Por favor inténtalo de nuevo más tarde");
							console.log('mensaje error: ' + msg);
						});*/

						

				        //CONFIGURATION
				        var options = {
				            replaceLineBreaks: false, // true to replace \n by a new line, false by default
				            android: {
				                intent: 'INTENT'  // send SMS with the native android SMS messaging
				                //intent: '' // send SMS without open any other app
				            }
				        };

				        var success = function () { alert('Message sent successfully'); };
				        var error = function (e) { alert('Message Failed:' + e); };
				        sms.send(d.telefono, ret.sms, options, success, error);
				    
					});
				}else if(ret.res=="ok"){
					new Alerta("Invitación pendiente de aceptación");
					e.remove();
				}
			})
		})
		
			
				
				
			
	        
	        
		
			//window.plugins.socialsharing.shareViaSMS('Prueba LifeSignal para tu smartphone. Visita http://picnic.pe/lifesignal/ para descargarlo',d.original,function(msg){console.log('ok: ' + msg);},function(msg) {alert('error: ' + msg);});
		
		
	})

}