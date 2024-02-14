<?php
    $inData = getRequestInfo(); // inData = data sent from JavaScript to PHP

    // Parameters
    $Status = $inData["Status"];
    $Changelog = $inData["Changelog"];
    $Ticket_ID = $inData["Ticket_ID"];

    // Connection Test
	$conn = new mysqli("localhost", "SpeedRunDev", "password", "TempName"); // connection to mySQL database User
	if( $conn->connect_error ) { // if connection failes, exit with error
		returnWithError( $conn->connect_error );
	}
	else {
        $stmt = $conn->prepare("UPDATE Ticket SET Status=?, Changelog=? WHERE Ticket_ID=?");
        $stmt->bind_param("sss", $Status, $Changelog, $Ticket_ID);
        $stmt->execute();
        $result = $stmt->get_result();

        $stmt->close();
        $conn->close();

        returnWithError("");
    }

    function getRequestInfo() { // handles json package sent from JavaScript
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj ) { // sends retult info of login attempt as json package
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err ) { // in event of error, sends error and fills all fields with empty placeholder
		$retValue = '{"Account_Num":0,"Account_Type":"","Name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
