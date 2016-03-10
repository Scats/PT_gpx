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
        var myDate;

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
        
        
        var longueur = google.maps.geometry.spherical.computeLength(points);
        console.log("La longuer est de " + longueur);
        
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
        
        function auKilometre(nombre){
            return Math.round(nombre);
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
        });

        $("#totalKm").append(auKilometre(longueur) + " m");
        $("#altMax").append(auCentieme(elevationFinalMax) + " m");
        $("#altMin").append(auCentieme(elevationFinalMin) + " m");
        
        
         console.log(elevationFinalMin);
        
        /*$(xml).find("time").each(function(){
            
            
            console.log($(this));
        });*/
        
        
        
        
        //myDate = new Date('2016-01-08T08:57:35Z'); //ISO-8601
        //console.log(myDate.getTimezoneOffset());
        
        poly.setMap(map);
        map.fitBounds(bounds);
    }
  
       
    
    
});