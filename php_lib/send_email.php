<?php
require 'phpmailer/PHPMailerAutoload.php';
/**
 * This example shows making an SMTP connection with authentication.
 */

//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
//date_default_timezone_set('Etc/UTC');

//SendEmail("Prueba de email desde Open AMS", "<b>Nueva prueba</b>", "edwinspire@gmail.com");

function SendEmail($Subject, $htmlBody,  $addCC, $Attachment = ""){

//Create a new PHPMailer instance
$mail = new PHPMailer;

//Tell PHPMailer to use SMTP
$mail->isSMTP();
//Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 0;
//Ask for HTML-friendly debug output
$mail->Debugoutput = 'html';
//Set the hostname of the mail server
$mail->Host = "mail.farmaenlace.com";
//Set the SMTP port number - likely to be 25, 465 or 587
$mail->Port = 465;
//Whether to use SMTP authentication
$mail->SMTPAuth = true;
//Username to use for SMTP authentication
$mail->Username = "edwindelacruz";
//Password to use for SMTP authentication
$mail->Password = "1715021828";

$mail->SMTPSecure = 'ssl'; 

//Set who the message is to be sent from
$mail->setFrom('edwindelacruz@farmaenlace.com', 'Monitoreo de Servidores');
//Set an alternative reply-to address
$mail->addReplyTo('soporte@farmaenlace.com', 'Soporte Farmaenlace');
//Set who the message is to be sent to
$mail->addAddress('soporte@farmaenlace.com', 'Soporte');
//Set the subject line
$mail->Subject = $Subject;
//Read an HTML message body from an external file, convert referenced images to embedded,
//convert HTML into a basic plain-text alternative body
//$mail->msgHTML(file_get_contents('contents.html'), dirname(__FILE__));
$mail->Body    = $htmlBody;
//Replace the plain text body with one created manually
$mail->AltBody = 'Mensaje automatico enviado por Open AMS';
//Attach an image file


//$mail->addAttachment('images/phpmailer_mini.png');
//$mail->addCC($address, $name = '');


$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);


echo "Empezando a enviar\n";
$r = $mail->send();
//send the message, check for errors
if (!$r) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message sent!";
}

return $r;
}





