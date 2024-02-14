const urlBase = 'http://tempname.online/LAMPAPI';
const extension = 'php';

/*
Global variables are available at all times from each page, 
but reset values each time the page changes.
*/

// global variables 
let Account_Num = 0;
let Account_Type = "";
let Name = "";

document.addEventListener('DOMContentLoaded', function() {
	if(window.location.pathname != "/index.html" && window.location.pathname != "/register.html" ) {
		readCookie();
	}

	if(window.location.pathname == "/HomePage.html") {
		loadCurrentTicket();
	}

	if(window.location.pathname == "/UpdateTicket.html") {
		loadSelectedTicket();
	}
}, false);

function doLogin() {  // it do indeed login
	Account_Num = 0;
	Account_Type = "";
	Name = "";
	
	// 'let login' and 'let password' are temp variables that hold the login information which the user will enter (email and password)
	// .value signifies a value entered by the user
	let login = document.getElementById("Email").value;
	let password = document.getElementById("Password").value;
	
	// .innerHTML signifies direct HTML code
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Email_Address:login,Password:password}; // {PHP target : js temp variable , PHP target : js temp variable}
	let jsonPayload = JSON.stringify( tmp ); // formats to be sent as json file
	
	let url = urlBase + '/Login.' + extension; // let url = urlBase (init line 1) + 'Login.php'

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request (line 27-29)
			if (this.readyState == 4 && this.status == 200) { // if connection is good...
				let jsonObject = JSON.parse( xhr.responseText ); // set temp object = response
				Account_Num = jsonObject.Account_Num; // setting account_num to the response number
		
				if( Account_Num < 1 ) {	// if less than 1, it means there is no Account_Num, meaning the account does not exist since the database increments by 1
					document.getElementById("loginResult").innerHTML = "Email/Password combination incorrect";
					return;
				}
		
				// setting values from json object (response values) to the current global variables
				Account_Type = jsonObject.Account_Type;
				Name = jsonObject.Name;

				saveCookie();
	
				// redirect after login
				window.location.href = "HomePage.html"; // this will change to my html file
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "Account_Type=" + Account_Type + ",Name=" + Name + ",Account_Num=" + Account_Num + ";expires=" + date.toGMTString();
}

function readCookie() {
	Account_Num = -1;
	let data = document.cookie; // grabs cookie from web page
	let splits = data.split(","); // split cookie into an array
	for(var i = 0; i < splits.length; i++) { //loop for each section of cookie
		let trimWhiteSpace = splits[i].trim();
		let tokens = trimWhiteSpace.split("=");
		
		// goes through each section of cookie and assigns to global variable, token 0 being left of =, token 1 being right of =
		if( tokens[0] == "Account_Type" ) {
			Account_Type = tokens[1];
		}
		else if( tokens[0] == "Name" ) {
			Name = tokens[1];
		}
		else if( tokens[0] == "Account_Num" ) {
			Account_Num = parseInt( tokens[1].trim() );
		}
	}
	
	if( Account_Num < 0 ) { // if cookie empty, return to home page
		window.location.href = "index.html";
	}
}

function doLogout() { // it do indeed logout
	Account_Num = 0;
	Account_Type = "";
	Name = "";
	document.cookie = "Account_Type= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister() {
	error = "";

	// retrieving user data and assigning to variables
	Name = document.getElementById("Name").value;
	let Email = document.getElementById("Email").value;
	let Password = document.getElementById("Password").value;
	Account_Type = document.getElementById("Dropdown").value;

	if (Name == "" || Email == "") {
        document.getElementById("loginResult").innerHTML = "All Fields Are Required";
        return;
    }
	
	//Regex to ensure the email entered is actually an email
    if ( ! (/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(Email) ) ) {
        document.getElementById("loginResult").innerHTML = "A Valid Email Is Required";
        return;
    }

	if (Password.length < 5) {
		document.getElementById("loginResult").innerHTML = "Password is too short";
		return;
	}

	if (Password != document.getElementById("Confirm Password").value) {
		document.getElementById("loginResult").innerHTML = "Passwords do not match";
		return;
	}

	let tmp = {Email_Address:Email,Password:Password, Name:Name, Account_Type:Account_Type}; // {PHP target : js temp variable , PHP target : js temp variable}
	let jsonPayload = JSON.stringify( tmp ); // formats to be sent as json file

	let url = urlBase + '/Register.' + extension; // let url = urlBase + 'Register.php'

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request
			if (this.readyState == 4 && this.status == 200) { // if connection is good...
				let jsonObject = JSON.parse( xhr.responseText ); // set temp object = response
				error = jsonObject.error;
		
				if( error != "" ) {	
					document.getElementById("loginResult").innerHTML = error;
					return;
				}

				document.getElementById("loginResult").innerHTML = "User Registered Successfully";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function submitTicket() {
	// retrieving user data and assigning to variables
	let Department = document.getElementById("Dropdown").value;
	let Description = document.getElementById("Description").value;
	let Status = "Submitted";
	document.getElementById("ticketResult").innerHTML = "";

	if(Department == "" || Description == "") {
		document.getElementById("ticketResult").innerHTML = "Please fill out all reqired fields";
		return;
	}

	let tmp = {Description:Description,Department:Department,Status:Status,Account_Num:Account_Num};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddTicket.' + extension; // let url = urlBase + 'AddTicket.php'

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request
			if (this.readyState == 4 && this.status == 200) { // if connection is good...
				document.getElementById("ticketResult").innerHTML = "Ticket Submitted";
				document.getElementById("Description").value = "";
				document.getElementById("Dropdown").selectedIndex = 0;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}


function updateTicketAdmin() {
	let Status = document.getElementById("Dropdown").value;
	let Changelog = document.getElementById("Changelog").innerHTML;
	Changelog += "<br>" + document.getElementById("Update").value; 
	let Ticket_ID = document.getElementById("Ticket_ID").innerHTML;
	document.getElementById("ticketResult").innerHTML = "";

	if(document.getElementById("Update").value == "") {
		document.getElementById("ticketResult").innerHTML = "Please fill out all reqired fields";
		return;
	}

	let tmp = {Status:Status,Changelog:Changelog,Ticket_ID:Ticket_ID};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateTicket.' + extension; // let url = urlBase + 'UpdateTicket.php'

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection
			if (this.readyState == 4 && this.status == 200) { // if connection is good...
				document.getElementById("ticketResult").innerHTML = "Ticket Updated";
				document.getElementById("Update").value = "";
				loadSelectedTicket();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function loadCurrentTicket() {
	document.getElementById("loadResult").innerHTML = "";

	let ticketList = "";

	let tmp = {Account_Num:Account_Num,Account_Type:Account_Type};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UserTickets.' + extension;

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if(jsonObject.results == null) {
					document.getElementById("loadResult").innerHTML = "No Tickets";
					return;
				}

				for(let i = jsonObject.results.length-1; i >= 0; i--) {
					let jsonString = JSON.stringify(jsonObject.results[i]);

					ticketList += `<div class="Ticket" id=${jsonObject.results[i].Ticket_ID}>
									<h3 class="TicketNumber">Ticket ${jsonObject.results[i].Ticket_ID}</h3>
									<p class="Department" id="${jsonObject.results[i].Ticket_ID}Department">${jsonObject.results[i].Department}</p>
									<button type="button" id="Edit" class="EditButton" onclick="location.href='UpdateTicket.html?Ticket_ID=${jsonObject.results[i].Ticket_ID}'">Edit</button>
									<p class="Status" id="${jsonObject.results[i].Ticket_ID}Status">${jsonObject.results[i].Status}</p>
									<p class="TicketDescription" id="${jsonObject.results[i].Ticket_ID}Description">${jsonObject.results[i].Description}</p>
									</div>`
				}

				document.getElementById("loadResult").innerHTML = ticketList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function loadSelectedTicket() {
	let search = window.location.search;
	let arrayTransfer = search.match(/(\d+)/);
	let Ticket_ID = arrayTransfer[0];
	console.log(Ticket_ID);

	let tmp = {Ticket_ID:Ticket_ID};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SelectedTicket.' + extension; // SelectedTicket.php

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if(jsonObject.results == null) {
					return;
				}
				let jsonString = JSON.stringify(jsonObject.results[0]);
				document.getElementById("Department").innerHTML = `${jsonObject.results[0].Department}`;
				document.getElementById("Description").innerHTML = `${jsonObject.results[0].Description}`;
				const statusOptions = ["Submitted","In Progress", "Requires Follow-Up", "Complete"];
				document.getElementById("StatusText").innerHTML = `${jsonObject.results[0].Status}`;

				if(Account_Type == "Admin") {
					document.getElementById("StatusText").style.display = "none";
					document.getElementById("Dropdown").style.display = "block";
				}
				
				for(let i = 0; i < 4; i++) {
					if(`${jsonObject.results[0].Status}` == statusOptions[i]) {
						document.getElementById("Dropdown").selectedIndex = i;
						break;
					}
				}

				document.getElementById("Changelog").innerHTML = `${jsonObject.results[0].Changelog}`;
				document.getElementById("Ticket_ID").innerHTML = Ticket_ID;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doFilter() {
	let DepartmentFilter = document.getElementById("DropdownDepartment").value;
	let StatusFilter = document.getElementById("DropdownStatus").value;

	if(DepartmentFilter == "" && StatusFilter == "") {
		loadCurrentTicket();
		return;
	}
	
	let ticketList = "";

	let temp = {Account_Num:Account_Num, Account_Type:Account_Type, Status:StatusFilter, Department:DepartmentFilter};
	
	let jsonPayload = JSON.stringify(temp);
	let url = urlBase + '/Filter.' + extension;

	// connection code
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() { // listening for the response of the POST connection request
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);

				if(jsonObject.results == null) {
					document.getElementById("loadResult").innerHTML = "No Tickets In This Filter";
					return;
				}

				for(let i = jsonObject.results.length-1; i >= 0; i--) {
					let jsonString = JSON.stringify(jsonObject.results[i]);

					ticketList += `<div class="Ticket" id=${jsonObject.results[i].Ticket_ID}>
									<h3 class="TicketNumber">Ticket ${jsonObject.results[i].Ticket_ID}</h3>
									<p class="Department" id="${jsonObject.results[i].Ticket_ID}Department">${jsonObject.results[i].Department}</p>
									<button type="button" id="Edit" class="EditButton" onclick="location.href='UpdateTicket.html?Ticket_ID=${jsonObject.results[i].Ticket_ID}'">Edit</button>
									<p class="Status" id="${jsonObject.results[i].Ticket_ID}Status">${jsonObject.results[i].Status}</p>
									<p class="TicketDescription" id="${jsonObject.results[i].Ticket_ID}Description">${jsonObject.results[i].Description}</p>
									</div>`
				}

				document.getElementById("loadResult").innerHTML = ticketList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}
