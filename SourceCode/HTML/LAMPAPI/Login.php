<?php

	$inData = getRequestInfo(); // inData = data sent from JavaScript to PHP
	
	// Parameters
	$Account_Num = 0;
	$Account_Type = "";
	$Name = "";

	// Connection Test
	$conn = new mysqli("localhost", "SpeedRunDev", "password", "TempName"); // connection to mySQL database User
	if( $conn->connect_error ) {  // if connection fails, exit with error
		returnWithError( $conn->connect_error );
	}
	else { // if connection succeeds, proceed 
		$stmt = $conn->prepare("SELECT Account_Type,Name,Account_Num FROM Account WHERE Email_Address =? AND Password =?"); // slecting from Account Table
		$stmt->bind_param("ss", $inData["Email_Address"], $inData["Password"]); // verify login info (email and password)
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  ) { // if login successful, return account information
			returnWithInfo( $row['Account_Type'], $row['Name'], $row['Account_Num'] ); 
		}
		else { // if login failed, return error
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
	
	function returnWithInfo( $Account_Type, $Name, $Account_Num ) { // taking account info from database, format as json package
		$retValue = '{"Account_Num":' . $Account_Num . ',"Account_Type":"' . $Account_Type . '","Name":"' . $Name . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
