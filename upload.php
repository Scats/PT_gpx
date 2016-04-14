<?php
	var_dump($_FILES);

  	if(isset($_FILES['file']))
  	{
    	$dossier = "cartes/";
    	$fichier = 'map.gpx';

    	if(move_uploaded_file($_FILES['file']['tmp_name'], $dossier . $fichier))
    	{
      		echo 'Upload avec succès !';
    	}
    	else
    	{
      		echo 'Erreur';
    	}
  	}

		header('Location: map.html');
		exit();

 ?>
