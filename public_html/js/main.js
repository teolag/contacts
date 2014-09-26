
var persons, tags;
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
btnCancelPersonEdit.addEventListener("click", cancelEditPerson, false);

var btnNewPerson = document.getElementById("btnNewPerson");
btnNewPerson.addEventListener("click", createNewPerson, false);

var btnSelectAll = document.getElementById("btnSelectAll");
btnSelectAll.addEventListener("click", selectAll, false);

var btnDeselectAll = document.getElementById("btnDeselectAll");
btnDeselectAll.addEventListener("click", deselectAll, false);



loadAll();



function loadAll() {
	var xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.addEventListener("load", allLoaded, false);
	xhr.open("get", "/action/get_all.php", true);
	xhr.send();
}


function allLoaded(e) {
	persons = e.target.response.persons;
	tags = e.target.response.tags;
	console.log(Object.keys(persons).length + " persons loaded");
	console.log(Object.keys(tags).length + " tags loaded");
	
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



function hasWordInTags(word, tagIds) {
	if(!tagIds) return false;
	
	for(var i=0; i<tagIds.length; i++) {
		var tag = tags[tagIds[i]].tag.toLowerCase();
	
		if(tag.indexOf(word)>-1) {
			return true;
		}
	}
	return false;
}

function filterPersons(e) {
	//console.log("filter", e.type, txtFilter.value, e);
	var words = txtFilter.value.split(" ");
		
	for(var id in persons) {
		var person = persons[id];
		var show = true;
		var personStr = (person.first_name + " " + person.last_name).toLowerCase();
		
		for(var j=0; j<words.length; j++) {
			var word = words[j].toLowerCase();
			
			var wordInPerson = personStr.indexOf(word)>-1;
			var wordInTags = hasWordInTags(word, person.tags);
			if(!wordInPerson && !wordInTags) {
				show=false;
				break;
			}			
		}
		
		if(show) {
			person.li.classList.remove("hidden");
		} else {
			person.li.classList.add("hidden");
		}
	}
	
}

function personListClickHandler(e) {

	li = e.target;
	while(li.nodeName!=="LI") {
		if(li===personList) return;
		li = li.parentNode;
	}
	
	console.log("click", e);
	if(e.ctrlKey || e.metaKey) {
		li.classList.toggle("selected");
	} else if(e.which===1) {
		deselectAll();
		li.classList.add("selected");
	}
	updateSelectedPersons();
	
}

function selectAll() {
	var visible = personList.querySelectorAll('li:not(.hidden)');
	for(var i=0; i<visible.length; i++) {
		var li = visible[i];
		li.classList.add("selected");
	}
	updateSelectedPersons();
}

function deselectVisible() {
	var selected = personList.querySelectorAll('li.selected:not(.hidden)');
	for(var i=0; i<selected.length; i++) {
		var li = selected[i];
		li.classList.remove("selected");
	}
	updateSelectedPersons();
}

function deselectAll() {
	var selected = personList.querySelectorAll('li.selected');
	for(var i=0; i<selected.length; i++) {
		var li = selected[i];
		li.classList.remove("selected");
	}
	updateSelectedPersons();
}

function updateSelectedPersons() {
	var selected = personList.querySelectorAll("li.selected");
	var ids = [];
	info.innerHTML="";
	
	for(var i=0; i<selected.length; i++) {
		var li = selected[i];
		ids.push(li.dataset.id);
	}
	
	if(ids.length===0) {
		info.textContent = "no contacts selected";
	} else if(ids.length===1) {
		showPerson(ids[0]);
		/*
		info.textContent = persons[ids[0]].first_name + " " + persons[ids[0]].last_name;
		
		var editButton = document.createElement("button");
		editButton.type="button";
		editButton.textContent = "Edit";
		editButton.dataset.personId=ids[0];
		editButton.addEventListener("click", editPerson, false);
		info.appendChild(editButton);
		*/
	} else {
		info.textContent = ids.length + " contacts selected";
		var joinButton = document.createElement("button");
		joinButton.type="button";
		joinButton.textContent = "Join";
		joinButton.dataset.personIds=ids;
		joinButton.addEventListener("click", joinPersons, false);
		info.appendChild(joinButton);
	}
}


function showPerson(personId) {
	var content = document.getElementById('tplPerson').content;
	var person = persons[personId];

	var firstName = content.querySelector('span.firstName');
    firstName.textContent = person.first_name;
	
	var lastName = content.querySelector('span.lastName');
    lastName.textContent = person.last_name;
	
	var birthdate = content.querySelector('span.birthdate');
    birthdate.textContent = person.birthdate.substr(0,10);
	
    info.appendChild(document.importNode(content, true));
}


function createNewPerson() {
	dialogPersonForm.reset();
	dialogPerson.showModal();
}

function editPerson(e) {
	dialogPersonForm.reset();
	var inputs = dialogPersonForm.elements;
	var personId = e.target.dataset.personId;
	var person = persons[personId];
	
	inputs.personId.value = personId;
	inputs.firstName.value = person.first_name;
	inputs.lastName.value = person.last_name;
	if(person.birthdate) {
		inputs.birthdate.value = person.birthdate.substr(0,10);
	}
	dialogPerson.showModal();
}

function joinPersons(e) {
	console.log("join persons", e.target.dataset.personIds);
}

function cancelEditPerson() {
	dialogPerson.close();
	dialogPersonForm.reset();
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