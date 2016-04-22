<?php
	//var_dump($_FILES);

  	if(isset($_FILES['file']))
  	{
    	$dossier = "cartes/";
    	$fichier = 'map.gpx';

    	if(move_uploaded_file($_FILES['file']['tmp_name'], $dossier . $fichier))
    	{
      		echo 'Upload avec succès !';
			header('Location: map.html');
			exit();
    	}
    	else
    	{
      		echo "Erreur vous n'avez pas mis de fichier, vous allez être redirigé dans 3 secondes";
			header('Refresh: 3; url=index.html');
    	}
  	}

		

 ?>
