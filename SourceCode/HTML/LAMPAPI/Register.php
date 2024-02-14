<?php
  $inData = getRequestInfo(); // inData = data sent from JavaScript to PHP

  // Parameters
  $Account_Num = 0;
  $Name = $inData["Name"];
  $Email_Address = $inData["Email_Address"];
  $Password = $inData["Password"];
  $Account_Type = $inData["Account_Type"];


  // Connection Test
	$conn = new mysqli("localhost", "SpeedRunDev", "password", "TempName"); // connection to mySQL database User
	if( $conn->connect_error ) { // if connection failes, exit with error
		returnWithError( $Email_Address, $conn->connect_error );
	}
	else { // if connection succeeds, proceed
    // check if account already exists
    $stmt = $conn->prepare("SELECT * FROM Account WHERE Email_Address = ?");
    $stmt->bind_param("s", $Email_Address);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = mysqli_num_rows($result); // counts num of rows in result (lookup of if the account with that email exists)
    if($rows == 0) { // if there were no rows, the account doesn't exist, proceed with creating accout
      $stmt = $conn->prepare("INSERT INTO Account (Name,Email_Address,Password,Account_Type) VALUES (?,?,?,?)");
      $stmt->bind_param("ssss", $inData["Name"], $inData["Email_Address"], $inData["Password"], $inData["Account_Type"]);
      $stmt->execute();
      $Account_Num = $conn->insert_id; // auto increments the account num for new account
      returnWithInfo($Account_Num, $Email_Address);
    }
    else { // if account already exists, return with error
      returnWithError($Email_Address, "An account with this information already exists");
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

  function returnWithError( $Email_Address, $err ) {
		$retValue = '{"Account_Num":0,"Email_Address":"' . $Email_Address . '","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

  function returnWithInfo( $Account_Num, $Email_Address ) {
		$retValue = '{"Account_Num":' . $Account_Num . ',"Email_Address":"' . $Email_Address . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
