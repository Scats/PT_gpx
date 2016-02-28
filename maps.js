var mapOptions = {
     mapTypeId: google.maps.MapTypeId.ROADMAP
}

var map = new google.maps.Map(document.getElementById("map"), mapOptions);

$.ajax({
    url: "cartes/breche.gpx",
    type: "GET",
    datatype: "xml",
    success:function(xml){
        
        
        var points = [];
        var bounds = new google.maps.LatLngBounds(); //Définit les limites de la carte
        var coordonneesMap;
        var lat, long;
        var elevation, elevationFinalMax = 0, elevationFinalMin=10000;

        $(xml).find("trkpt").each(function(){
            lat = $(this).attr("lat");
            lng = $(this).attr("lon");

            coordonneesMap = new google.maps.LatLng(lat, lng);
            
            points.push(coordonneesMap);
            bounds.extend(coordonneesMap);
            
        });
        
        var poly = new google.maps.Polyline({
          path: points,
          strokeColor: "#FF00AA",
          strokeOpacity: .7,
          strokeWeight: 4,
        });
        
        
       /** INSERTION DES DEUX MARKES **/
        
        var marker_start = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-start.png",
            position: points[0],
            map: map,
        });
        
        
        var marker_end = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-end.png",
            position: points[points.length-1],
            map: map,
        });
        
        /** END MARKERS **/
        
        function auCentieme(nombre){
            return Math.round(100*nombre)/100;
        }
        
        $(xml).find("ele").each(function(){
            elevation = $(this).text();
            
            if(elevation <= elevationFinalMin)
                {
                    elevationFinalMin = elevation;
                }
                        
            if(elevation >= elevationFinalMax)
                {
                    elevationFinalMax = elevation;
                }
            
            Math.rou
            
        });

        $("#altMax").append(auCentieme(elevationFinalMax) + " m");
        $("#altMin").append(auCentieme(elevationFinalMin) + " m");
        
        
         console.log(elevationFinalMin);
        
        
        poly.setMap(map);
        map.fitBounds(bounds);}
    
});