var Sobre = function(){
	this.dom = $("#sobre");
	
	this.mostrar = function(){
		
		header.mostrar("back");

		Sobre.prototype.mostrar.call(this);
	}

}
Sobre.prototype = new Seccion();