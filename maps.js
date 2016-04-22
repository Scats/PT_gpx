$.ajax({
    url: "cartes/map.gpx",
    type: "GET",
    datatype: "xml",
    success:function(xml){

        var lat = new Array();
		var lng = new Array();
		var samples = 350;
		var i = 0;
		var distance = 0;
		var distances = [];

        $(xml).find("trkpt").each(function(){
            lat[i] = parseFloat($(this).attr("lat"));
            lng[i] = parseFloat($(this).attr("lon"));

			i++;
        });

        var maxPath = Math.round(lat.length / samples);
		var path = [];

		if (maxPath > 1)
		{
			for(var i in lat)
			{
				if(( i %maxPath ) == 0) path.push({'lat':lat[i],'lng':lng[i]});
			}
		}else
		{
			path.push({'lat':lat[i],'lng':lng[i]});
		}

		console.log("MaxPath: " + maxPath);

		var elevator = new google.maps.ElevationService;

		var map = new google.maps.Map(document.getElementById('map'), {
    		zoom: 12,
    		center: path[1],
			streetViewControl: false,
    		mapTypeId: 'terrain'
  		});

		var poly = new google.maps.Polyline({
          path: path,
          strokeColor: "#0058ff",
          strokeOpacity: .7,
          strokeWeight: 4,
		  map: map
        });

		elevator.getElevationAlongPath({
    		'path': path,
    		'samples': samples
  		}, plotElevation);

		function plotElevation(elevations, status) {

		var mousemarker = null;

	  	var chartDiv = document.getElementById('elevation_chart');
	  	if (status !== google.maps.ElevationStatus.OK) {
			// Show the error code inside the chartDiv.
			chartDiv.innerHTML = 'Cannot show elevation: request failed because ' + status;
			return;
	  	}
	  	// Create a new chart in the elevation_chart DIV.
	  	var chart = new google.visualization.ColumnChart(chartDiv);

	  	// Extract the data from which to populate the chart.
	  	// Because the samples are equidistant, the 'Sample'
	  	// column here does double duty as distance along the
	  	// X axis.
	  	var data = new google.visualization.DataTable();
	  	data.addColumn('string', 'Sample');
	  	data.addColumn('number', 'Altitude');
	  	for (var i = 0; i < elevations.length; i++) {

		  		var dist = (distance/1000).toFixed(1) ;
				var dist_z = (distance/1000).toFixed(0) ;
				if ( dist == dist_z ) dist = dist_z ;
				data.addRow([''+ dist + ' Km', elevations[i].elevation]);
				if ( i < elevations.length - 1 )
				{
					distances[i] = google.maps.geometry.spherical.computeDistanceBetween (elevations[i].location, elevations[i+1].location);
					distance = distance + distances[i];
				}
	  	}
			
	  	// Draw the chart using the data within its DIV.
	  	chart.draw(data, {
			height: 160,
			legend: 'none',
	  	});

	  	google.visualization.events.addListener(chart, 'onmouseover', function(e)
		{
			if (mousemarker == null)
			{
				mousemarker = new google.maps.Marker({
				position: elevations[e.row].location,
				map: map,
				icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
				});
			}
			else {
				mousemarker.setPosition(elevations[e.row].location);
			}
		});
		
		console.log(distance);
		$("#distance").append(auKilometre(distance));
	}
     
       /** INSERTION DES DEUX MARKES **/
        var marker_start = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-start.png",
            position: path[0],
            map: map,
        });


        var marker_end = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-end.png",
            position: path[path.length-1],
            map: map,
        });
        /** END MARKERS **/
		
		/** CALCUL DE L'ELEVATION **/
		var elevationFinalMax = 0;
		var elevationFinalMin = 10000;

        $(xml).find("ele").each(function(){
            var elevation = $(this).text();

            if(elevation <= elevationFinalMin)
                {
                    elevationFinalMin = elevation;
                }

            if(elevation >= elevationFinalMax)
                {
                    elevationFinalMax = elevation;
                }
        });

        $("#altMax").append(arrondiUnite(elevationFinalMax));
        $("#altMin").append(arrondiUnite(elevationFinalMin));

        console.log(elevationFinalMin);
		/** END ELEVATION **/
		
		/** CALCUL DATE **/
		var lesDates = [] ;
		var k =0;
		var myDateStart;
		var myDateEnd;
		
        $(xml).find("time").each(function(){

			lesDates[k] = $(this).text();
			k++;
            
        });
		
		myDateStart = new Date(lesDates[0]);
		myDateEnd = new Date(lesDates[lesDates.length-1]);
		
		console.log(myDateStart);
		console.log(myDateEnd);
		
		var dif = dateDiff(myDateStart, myDateEnd);
		
		$("#duree").append(dif.hour + "h" + dif.min + "min" + dif.sec + "s");
		/** END DATE **/
    }

});
	
function auKilometre(longeur)
{
	var longeur = longeur / 1000;
	return longeur.toFixed(2) + " km";
}

function arrondiUnite(longueur)
{
	var longeur = longueur;
	return Math.round(longeur) + " m";
	
}

function dateDiff(date1, date2){
    var diff = {}                           
    var tmp = date2 - date1;
	var total;
 
    tmp = Math.floor(tmp/1000);             
    diff.sec = tmp % 60;                    
 
    tmp = Math.floor((tmp-diff.sec)/60);    
    diff.min = tmp % 60;                    
 
    tmp = Math.floor((tmp-diff.min)/60);    
    diff.hour = tmp % 24;                   
     
    tmp = Math.floor((tmp-diff.hour)/24);   
    diff.day = tmp;
     
    return diff;
}
