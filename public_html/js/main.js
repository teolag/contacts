
var persons, tags;

var personArea = XI.select('.area[data-area="person"]');


var info = XI.selectId("info");

var tplPerson = XI.selectId("tplPerson");


var btnNewPerson = XI.selectId("btnNewPerson");
	btnNewPerson.addEventListener("click", PersonEdit.new, false);




loadAll();



/*
function initialize() {
  var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
  var mapOptions = {
    zoom: 4,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
*/




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

	PersonList.update();
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



function deselectVisible() {
	var selected = personList.querySelectorAll('li.selected:not(.hidden)');
	for(var i=0; i<selected.length; i++) {
		var li = selected[i];
		li.classList.remove("selected");
	}
	updateSelectedPersons();
}



PersonList.onChange(function(ids) {
	if(ids.length===0) {
		console.log("show startpage");
	} else if(ids.length===1) {
		showPerson(ids[0]);
	} else {
		personArea.innerHTML = ids.length + " contacts selected";
		var joinButton = document.createElement("button");
		joinButton.type="button";
		joinButton.textContent = "Join";
		joinButton.dataset.personIds=ids;
		joinButton.addEventListener("click", joinPersons, false);
		personArea.appendChild(joinButton);
	}
});


function showPerson(personId) {
	var person = persons[personId];


	var content = XI.selectId('tplPerson').content;

	var firstName = content.querySelector('span.firstName');
    firstName.textContent = person.firstName;

	var lastName = content.querySelector('span.lastName');
    lastName.textContent = person.lastName;

	var birthdate = content.querySelector('span.birthdate');
	if(person.birthdate) {
	    birthdate.textContent = person.birthdate.substr(0,10);
	} else {
		birthdate.textContent = "birthday unknown";
	}

	var tagList = content.querySelector('.person-tags');
	tagList.innerHTML = "";
	if(person.tags) {
		person.tags.forEach(function(tagId) {
			var tag = tags[tagId];
			console.log("tag", tag);
			XI.create("li", {
				class: "person-tag",
				text: tag.tag,
				data: {tagId: tagId},
				appendTo: tagList
			});
		});
	}


	personArea.innerHTML = "";
	personArea.appendChild(document.importNode(content, true));

	var editButton = personArea.querySelector(".person-edit");
	editButton.dataset.personId = personId;
	editButton.addEventListener("click", PersonEdit.edit, false);

	var addTagButton = personArea.querySelector(".person-add-tag");
	addTagButton.dataset.personId = personId;
	addTagButton.addEventListener("click", addTag, false);
}



function addTag(e) {
	console.log("Add tag", e.target.dataset);
	var personId = parseInt(e.target.dataset.personId);

	var options = [];
	var tagIds = Object.keys(tags);
	for(var i=0; i<tagIds.length; i++) {
		options.push({id: parseInt(tagIds[i]), text: tags[tagIds[i]].tag});
	}

	XioPop.select({
		title: "Add tag",
		text: "Select or create a new tag for this person",
		options: options,
		allowCreate: true,
		onSubmit: tagChosen
	});

	function tagChosen(answer) {
		if(answer.index===-1) {
			createNewTag(answer.text);
		} else {
			addTagToPerson(personId, answer.id);
		}
	}

	function createNewTag(tag) {
		XI.post("/action/add_tag.php", {
			data: {tag: tag},
			callback: tagCreated
		});
		console.log("New tag", tag);

		function tagCreated(data) {
			console.log("tag created", data);
		}

	}

}


function addTagToPerson(personId, tagId) {
	console.log("Add tag", tagId, "to person", personId);
}


function joinPersons(e) {
	console.log("join persons", e.target.dataset.personIds);
}



function sortPersons(personIds, order, reverse) {
	personIds.sort(function(id1,id2) {
		var p1 = persons[id1];
		var p2 = persons[id2];
		switch(order) {
			case "name":
			var n1 = (p1.firstName+p1.lastName).toLowerCase();
			var n2 = (p2.firstName+p2.lastName).toLowerCase();
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