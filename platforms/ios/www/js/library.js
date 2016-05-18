var Library = function(){

	this.set = function(v,f){
		
		$.get(f, function(res) {

			lib[v] = res;
		}, 'text');
	}

	this.set('ItemGrupo','library/ItemGrupo.html');
	this.set('ItemMiembro','library/ItemMiembro.html');
	this.set('ItemContacto','library/ItemContacto.html');
	this.set('ItemInvitacion','library/ItemInvitacion.html');

}
var lib = new Library();