
var persons;
var txtFilter = document.getElementById("filter");
txtFilter.addEventListener("keyup", filterPersons, false);
txtFilter.addEventListener("change", filterPersons, false);
txtFilter.addEventListener("search", filterPersons, false);
	
var personList = document.getElementById("persons");
personList.addEventListener("click", personListClickHandler, false);

var info = document.getElementById("info");

var dialogPerson = document.getElementById("dialogPerson");
var dialogPersonForm = dialogPerson.querySelector("form");
dialogPersonForm.addEventListener("submit", submitPerson, false);


var btnCancelPersonEdit = document.getElementById("btnCancelPersonEdit");

var btnNewPerson = document.getElementById("btnNewPerson");
btnNewPerson.addEventListener("click", createNewPerson, false);



loadAll();



function loadAll() {
	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.addEventListener("load", allPersonsLoaded, false);
	xhr.open("get", "/action/get_all.php", true);
	xhr.send();
}


function allPersonsLoaded(e) {
	persons = e.target.response.persons;
	console.log(Object.keys(persons).length, "persons loaded");
	
	printPersonList();	
}



function printPersonList() {
	var listItems = document.createDocumentFragment();
	
	var personIds = Object.keys(persons);
	personIds = sortPersons(personIds, 'name');
	
	
	for(var i=0; i<personIds.length; i++) {
		var person = persons[personIds[i]];
		var li = document.createElement("LI");
		li.dataset.id = personIds[i];
		li.textContent = person.first_name + " " + person.last_name + " (" + (person.birthdate ? getAge(new Date(person.birthdate)) : "unknown") + ")";
		listItems.appendChild(li);		
		person.li = li;
	}
	
	personList.innerHTML="";
	personList.appendChild(listItems);
}

function filterPersons(e) {
	console.log("filter", e.type, txtFilter.value, e);
	
	for(var id in persons) {
		var person = persons[id];
		var show = true;
		var personStr = (person.first_name + " " + person.last_name).toLowerCase();
		var words = txtFilter.value.split(" ");
		for(var j=0; j<words.length; j++) {
			var word = words[j].toLowerCase();
			if(personStr.indexOf(word)===-1) {
				show=false;
				break;
			}
		}
		//console.log("p", person, show);		
		
		
		if(show) {
			person.li.classList.remove("hidden");
		} else {
			person.li.classList.add("hidden");
		}
	}
}

function personListClickHandler(e) {
	console.log("list click", e);

	li = e.target;
	while(li.nodeName!=="LI") {
		if(li===personList) return;
		li = li.parentNode;
	}
	
	li.classList.toggle("selected");
	updateSelectedPersons();
	
	console.log("id:", li.dataset.id);

}

function updateSelectedPersons() {
	var selected = personList.querySelectorAll("li.selected");
	var ids = [];
	
	for(var i=0; i<selected.length; i++) {
		var li = selected[i];
		ids.push(li.dataset.id);
	}
	
	info.textContent = "";
	
	console.log(ids);
	
}


function createNewPerson() {
	dialogPersonForm.reset();
	dialogPerson.showModal();
}


function submitPerson(e) {
	var formData = new FormData(dialogPersonForm);
	
	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.addEventListener("load", submitPersonCallback, false);
	xhr.open("POST", "/action/person_update.php", true);
	xhr.send(formData);
	
	
	dialogPerson.close();
	e.preventDefault();
}

function submitPersonCallback(e) {
	console.log("submitPersonCallback", e);
}




function sortPersons(personIds, order, reverse) { 
	personIds.sort(function(id1,id2) {
		var p1 = persons[id1]; 
		var p2 = persons[id2]; 
		switch(order) { 
			case "name": 
			var n1 = (p1.first_name+p1.last_name).toLowerCase(); 
			var n2 = (p2.first_name+p2.last_name).toLowerCase(); 
			if (n1 < n2) return -1; 
			if (n1 > n2) return 1; 
			return 0; 
			
			case "age":
			var b1 = new Date(p1.birthdate);
			var b2 = new Date(p2.birthdate);
			return b2-b1;
			break;
			
			case "birthday":
			var b1 = new Date(p1.birthdate);
			var b2 = new Date(p2.birthdate);
			b1.setFullYear(1970);
			b2.setFullYear(1970);
			return b1-b2;
			break;
		}
	});
	if(reverse) { 
		personIds.reverse(); 
	} 
	return personIds;
}


function getAge(birthday) {
	birthday.setHours(0,0,0,0);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}