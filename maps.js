var mapOptions = {
     mapTypeId: google.maps.MapTypeId.ROADMAP
}

var map = new google.maps.Map(document.getElementById("map"), mapOptions);

$.ajax({
    url: "cartes/map.gpx",
    type: "GET",
    datatype: "xml",
    success:function(xml){
        
        
        var points = [];
        var bounds = new google.maps.LatLngBounds(); //Définit les limites de la carte
        var coordonneesMap;
        var lat, long;
        var test;
        var lastCoordonnees;

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
        
        //console.log(coordonneesMap);
        
        var marker_first = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-start.png",
            position: points[points.length-1],
            map: map,
        });
        
        marker_first.setMap(map);
        
        var marker_end = new google.maps.Marker({
            icon: "http://maps.google.com/mapfiles/dd-end.png",
            position: points[0],
            map: map,
        });
        
        marker_end.setMap(map);
        
        
        console.log(coordonneesMap.lat());
        
        poly.setMap(map);
        map.fitBounds(bounds);}
    
});