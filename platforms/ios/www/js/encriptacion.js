var Enc = function(){


	this.encriptar =function(frase,llave){
		var palval = 0;
		var llaval = 0;
		var cont=0;
		var resultado="";

		for(var i = 0; i<frase.length;i++){

			palval = parseInt(frase.charCodeAt(i));
			if(cont > llave.length-1) cont = 0;
			llaval = parseInt(llave.charCodeAt(cont));
			cont++; 
			palval += llaval + 64;
			if(palval > 255) palval-=255;
			//console.log(palval);
			resultado+=String.fromCharCode(palval);
		}
		
		return btoa(resultado);
	}
	this.desencriptar = function(frase,llave){
		var palval=0;
		var llaval=0;
		var contador=0;
		var resultado="";

		frase = atob(frase);

		for(var i=0;i<frase.length;i++){
			palval = parseInt(frase.charCodeAt(i));
			if(contador > llave.length-1) contador = 0;
			llaval = parseInt(llave.charCodeAt(contador));
			contador++;
			palval = (palval - llaval) - 64;
			if(palval < 0) palval +=255;
			resultado += String.fromCharCode(palval);

		}
		return resultado;
	}
}