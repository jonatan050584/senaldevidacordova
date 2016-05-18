var mapa;
var existemapa = false;
var Ubicacion = function(){

	this.dom = $("#ubicacion");
	this.titulo = "Ubicación";
	this.contactos = null;
	this.markers = new Array();
	this.iniciarMapa = function(){
		if(!existemapa){
			existemapa=true;

			/*var styles = [
		      {
		        featureType:"poi.business",
		        elementType:"labels",
		        stylers:[
		          {
		            visibility:"off"
		          }
		        ]
		      }
		    ];

		    var mapOptions = {
		      center: new google.maps.LatLng(-12.071854, -77.115097),
		      zoom: 10,
		      mapTypeId: 'OSM',
		      streetViewControl:false,
		      mapTypeControl:false,
		      zoomControl: false,
		      styles: styles
		    };


		    mapa = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		    mapa.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));*/


			//var db = window.sqlitePlugin.openDatabase({name: "limamapa.sqlite"});
			mapa = L.map('map-canvas').setView([-12.050987, -77.112587], 12);
		
			//this works, but is online:
			/*
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18
			}).addTo(map);
			*/
			
			//TODO build something to fall back to web if not found.
			L.tileLayer('MapQuest/{z}/{x}/{y}.jpg', {
				maxZoom: 16,
				minZoom: 12
			}).addTo(mapa);
		}
		var idsMiembros = new Array();
		$.each(internagrupo.miembros,function(key,val){
			idsMiembros.push(val.id);
		})
		setTimeout(function(){
			socket.emit("pedirultimasposiciones",idsMiembros);	
		},2000);
		


		//navigator.geolocation.getCurrentPosition(this.onMyPosition, this.onError);
		//-12.071854, -77.115097

		
	}

	socket.on("mostrarposiciones",function(data){
		
		ubicacion.onPosiciones(data);

		
	})

	this.onError = function(error){
		console.log('code: '    + error.code    + '\n' +  'message: ' + error.message + '\n');
	}
	

	this.onPosiciones = function(data){
		
		console.log(data);
		console.log(internagrupo.miembros);
		$.each(internagrupo.miembros,function(key,val){
			if(data[parseInt(val.id)]!=null){
				if(ubicacion.markers[parseInt(val.id)]==undefined){
					//crear marker
					var img = escape(val.pic);

					/*var icono = {
				    	url:'http://picnic.pe/clientes/lifesignal/api/imagen.php?path='+img,
				    	scaledSize: new google.maps.Size(40, 40)
				    }

				    var marker = new google.maps.Marker({
				      clickable:true,
				     	
				      icon: icono,
				      shadow:null,
				      zIndex:999,
				      map:mapa,
				      position:{lat:data[parseInt(val.id)].lat,lng:data[parseInt(val.id)].lon}
				    });*/
					var lat = data[parseInt(val.id)].lat;
					var lng = data[parseInt(val.id)].lon;


					var myIcon = L.icon({
					    iconUrl: 'http://picnic.pe/clientes/lifesignal/api/imagen.php?path='+img,
					    //iconRetinaUrl: 'my-icon@2x.png',
					    iconSize: [40, 40],
					    //iconAnchor: [20, 20],
					    //popupAnchor: [-3, -76],
					    //shadowUrl: 'my-icon-shadow.png',
					    //shadowRetinaUrl: 'my-icon-shadow@2x.png',
					    //shadowSize: [68, 95],
					    //shadowAnchor: [22, 94]
					});

					var marker = L.marker([lat,lng],{
						icon:myIcon
					}).addTo(mapa);

				   
				    ubicacion.markers[parseInt(val.id)] = marker;
				}else{
					
					var m = ubicacion.markers[parseInt(val.id)];

					//var latlng = new google.maps.LatLng(data[parseInt(val.id)].lat,data[parseInt(val.id)].lon);
					//m.setPosition(latlng);

					m.setLatLng([data[parseInt(val.id)].lat,data[parseInt(val.id)].lon]);

				}
				
				//google.maps.event.clearInstanceListeners(ubicacion.markers[parseInt(val.id)]);

				//ubicacion.markers[parseInt(val.id)].addListener("click",function(){
				ubicacion.markers[parseInt(val.id)].on("click",function(e){


					var fecha = new Date(data[parseInt(val.id)].datetime);
					console.log(fecha.getHours());

					var ho = fecha.getHours();
					console.log(ho);
					var ampm;

					if(ho<12) ampm = "AM";
					else ampm = "PM";
					var hora=ho;
					if(ho==0) hora="12";
					if(ho>12) hora=String(ho-12);
					console.log(hora);
					hora = String("0"+String(hora)).substr(-2);

					var minutos = fecha.getMinutes();
					var dia = String("0"+String(fecha.getDate())).substr(-2);
					var mes = String("0"+String(fecha.getMonth()+1)).substr(-2);
					var anio = fecha.getFullYear();

					

					var formatdate = hora+":"+minutos+ampm+" "+dia+"/"+mes+"/"+anio;

					var html = '<img src="'+val.pic+'" width="100" height="100" style="margin:auto;display:block;margin-bottom:20px">'+
								val.nombres+" "+val.apellidos+
								'<br><span style="font-size:11px">Última posición a las <br>'+formatdate+'</span>';
				    new Alerta(html,"Llamar",function(){

				    	window.open("tel:"+val.telefono, '_system');
				    	$("#alerta").show();
				    });
				})

				
			}
		})
	}

	

}
Ubicacion.prototype = new Seccion();