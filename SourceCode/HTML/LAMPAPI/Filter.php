<?php
    $inData = getRequestInfo(); // inData = data sent from JavaScript to PHP
	
	// Parameters
    $Account_Num = $inData["Account_Num"];
    $Account_Type = $inData["Account_Type"];
    $Status = $inData["Status"];
    $Department = $inData["Department"];
    $searchResults = "";
    $searchCount = 0;

    // Connection Test
	$conn = new mysqli("localhost", "SpeedRunDev", "password", "TempName"); // connection to mySQL database User
	if( $conn->connect_error ) { // if connection failes, exit with error
		returnWithError( $conn->connect_error );
	}
	else {
        if($Account_Type == "Basic") {
            if($Department == "") {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Status LIKE ? AND Account_Num=?");
                $stmt->bind_param("ss", $Status, $Account_Num);
            }
            elseif($Status == "") {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Department LIKE ? AND Account_Num=?");
                $stmt->bind_param("ss", $Department, $Account_Num);
            }
            else {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Status LIKE ? AND Department LIKE ? AND Account_Num=?");
                $stmt->bind_param("sss", $Status, $Department, $Account_Num);
            }
        }
        else {
            if($Department == "") {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Status LIKE ?");
                $stmt->bind_param("s", $Status);
            }
            elseif($Status == "") {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Department LIKE ?");
                $stmt->bind_param("s", $Department);
            }
            else {
                $stmt = $conn->prepare("SELECT * FROM Ticket WHERE Status LIKE ? AND Department LIKE ?");
                $stmt->bind_param("ss", $Status, $Department);
            }
        }

        $stmt->execute();
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc()) {
            if($searchCount > 0) {
                $searchResults .= ",";
            }
            $searchCount++;

            // building jsonObject to return
            $searchResults .= '{"Ticket_ID" : ' . $row["Ticket_ID"] . ', "Department" : "' . $row["Department"] . '", "Status" : "' . $row["Status"] . '", "Description" : "' . $row["Description"] . '"}';
        }

        if($searchCount == 0) {
            returnWithError("No Tickets Found");
        }
        else {
            returnWithInfo($searchResults);
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
