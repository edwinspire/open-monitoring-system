<?php 

function email_notification(){
$url = 'https://api.sendgrid.com/';
$user = 'USERNAME';
$pass = 'PASSWORD';

$params = array(
    'api_user'  => $user,
    'api_key'   => $pass,
    'to'        => 'edwinspire@gmail.com.com',
    'subject'   => 'testing from curl',
    'html'      => 'testing body',
    'text'      => 'testing body',
    'from'      => 'edwindelacruz@farmaenlace.com',
  );


$request =  $url.'api/mail.send.json';

// Generate curl request
$session = curl_init($request);
// Tell curl to use HTTP POST
curl_setopt ($session, CURLOPT_POST, true);
// Tell curl that this is the body of the POST
curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
// Tell curl not to return headers, but do return the response
curl_setopt($session, CURLOPT_HEADER, false);
// Tell PHP not to use SSLv3 (instead opting for TLS)
curl_setopt($session, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
print_r($response);
}

function email_notificationx($d){

require("phpmailer/class.phpmailer.php");
require("phpmailer/class.smtp.php");

$mail = new PHPMailer();

$body = "Cuerpo del mensaje";

$mail->IsSMTP(); 

// la dirección del servidor, p. ej.: smtp.servidor.com
$mail->Host = "mail.farmaenlace.com";

// dirección remitente, p. ej.: no-responder@miempresa.com
$mail->From = "edwindelacruz@farmaenlace.com";

// nombre remitente, p. ej.: "Servicio de envío automático"
$mail->FromName = "Open Alarm Management System";

// asunto y cuerpo alternativo del mensaje
$mail->Subject = "Mensaje de prueba";
$mail->AltBody = "Cuerpo alternativo 
    para cuando el visor no puede leer HTML en el cuerpo"; 

// si el cuerpo del mensaje es HTML
$mail->MsgHTML($body);

// podemos hacer varios AddAdress
$mail->AddAddress("edwindelacruz@farmaenlace.com", "edwinspire@gmail.com");

// si el SMTP necesita autenticación
$mail->SMTPAuth = true;


$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

// credenciales usuario
$mail->Username = "edwindelacruz";
$mail->Password = "1715021828"; 

if(!$mail->Send()) {
echo "Error enviando: " . $mail->ErrorInfo;
} else {
echo "¡¡Enviado!!";
}

}

email_notificationx("");

?>

