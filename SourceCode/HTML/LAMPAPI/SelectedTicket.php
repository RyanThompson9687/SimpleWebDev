<?php
    $inData = getRequestInfo(); // inData = data sent from JavaScript to PHP

    // Parameters
    $Ticket_ID = $inData["Ticket_ID"];

    // Connection Test
	$conn = new mysqli("localhost", "SpeedRunDev", "password", "TempName"); // connection to mySQL database User
	if( $conn->connect_error ) { // if connection failes, exit with error
		returnWithError( $conn->connect_error );
	}
	else {
        $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Ticket_ID=?");
        $stmt->bind_param("s", $Ticket_ID);
        $stmt->execute();
        $result = $stmt->get_result();

        if($row = $result->fetch_assoc()) {
            $ticketInfo .= '{"Ticket_ID" : ' . $row["Ticket_ID"] . ', "Department" : "' . $row["Department"] . '", "Status" : "' . $row["Status"] . '", "Description" : "' . $row["Description"] . '", "Changelog" : "' . $row["Changelog"] . '"}';
            returnWithInfo($ticketInfo);
        }
        else {
            returnWithError("No Ticket Found");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() { // handles json package sent from JavaScript
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj ) { // sends retult info as json package
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err ) { // in event of error, sends error and fills all fields with empty placeholder
		$retValue = '{"Account_Num":0,"Account_Type":"","Name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $searchResults ) {
        $retValue = '{"results":['.$searchResults.'],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>
