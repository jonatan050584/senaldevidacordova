var Registro = function(){
	this.dom = $("#registro");
	this.titulo = "Regístrate";
	this.error = false;



	this.mostrar = function(){
		
		header.mostrar("back");

		Registro.prototype.mostrar.call(this);
	}

	var validarLleno = function(campo){

		var input = $("#registro input[name="+campo+"]");
		input.removeClass("required");
		if(input.val()==""){
			input.addClass("required");
			registro.error = true;
		}
		return input.val();
	}

	var validarEmail = function(email) {
		var ret = true;
	    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    if (!expr.test(email)) ret = false;
	    return ret;
	}

	var validarSiNumero = function(numero){
		var ret = true;
	    if (!/^([0-9])*$/.test(numero)) ret = false;
	    return ret;
	      
	  }

	new Boton($("#registro .bt.guardar"),function(){
		registro.error = false;

		var nom = validarLleno("nombres");
		var ape = validarLleno("apellidos");
		var tel = validarLleno("telefono");
		var em = validarLleno("email");
		var cla = validarLleno("clave");
		var recla = validarLleno("reclave");

		if(!registro.error){
			
			if(cla!=recla){
				msg = "Las contraseñas no coinciden";
				campo ="reclave";
				registro.error=true;
			}
			if(cla.length<8){
				msg = "La contraseña debe tener mínimo 8 caracteres";
				registro.error = true;
				campo="clave";
			}

			if(!validarEmail(em)){
				msg = "Debe ingresar una dirección de email válida";
				registro.error = true;
				campo="email";
			}

			if(!validarSiNumero(tel) || tel.substr(0,1)!="9" || tel.length!=9){
				msg = "Deben ingresar un número de celular válido";
				registro.error = true;
				campo="telefono";
			}

			if(registro.error){
				new Alerta(msg);
				$("#registro input[name="+campo+"]").addClass("required");
			}else{

				//registrar

				

				new Request("usuario/registrar",{
					nombres:nom,
					apellidos:ape,
					email:em,
					telefono:tel,
					clave:cla
				},function(res){
					
					if(res.error){
						new Alerta(res.msg);
					}else{
						
						usuario = new Usuario();
						usuario.iniciar(res);
					}

				},{
					espera:"Registrando..."
				})

			}
		
		}

		
		

		


	});
	
	
}
Registro.prototype = new Seccion();