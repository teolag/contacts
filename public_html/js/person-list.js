
var PersonList = (function() {
	var txtFilter = XI.select(".person-list-filter");
	txtFilter.addEventListener("keyup", filterPersons, false);
	txtFilter.addEventListener("change", filterPersons, false);
	txtFilter.addEventListener("search", filterPersons, false);

	var selectedChangedCallback = function(){};

	var list = XI.select(".person-list");
	list.addEventListener("click", clickHandler, false);

	var btnSelectAll = document.getElementById("btnSelectAll");
	btnSelectAll.addEventListener("click", selectAll, false);

	var btnDeselectAll = document.getElementById("btnDeselectAll");
	btnDeselectAll.addEventListener("click", deselectAll, false);


	function clickHandler(e) {
		li = e.target;
		while(li.nodeName!=="LI") {
			if(li===personList) return;
			li = li.parentNode;
		}

		if(e.ctrlKey || e.metaKey) {
			li.classList.toggle("selected");
		} else if(e.which===1) {
			removeSelectedFromAll();
			li.classList.add("selected");
		}
		selectedChanged();
	}


	function selectedChanged() {
		var items = Array.from(list.querySelectorAll(".selected"));
		var ids = items.map(function(li) {
			return parseInt(li.dataset.id);
		});
		console.log("selected", ids);

		selectedChangedCallback(ids)
	}


	function selectAll() {
		var visible = list.querySelectorAll('.person-list-item:not(.hidden)');
		for(var i=0; i<visible.length; i++) {
			var li = visible[i];
			li.classList.add("selected");
		}
		selectedChanged();
	}


	function deselectAll() {
		removeSelectedFromAll();
		selectedChanged();
	}

	function removeSelectedFromAll() {
		var selected = list.querySelectorAll('.selected');
		for(var i=0; i<selected.length; i++) {
			var li = selected[i];
			li.classList.remove("selected");
		}
	}


	function update() {
		var listItems = document.createDocumentFragment();

		var personIds = Object.keys(persons);
		personIds = sortPersons(personIds, 'name');


		for(var i=0; i<personIds.length; i++) {
			var person = persons[personIds[i]];

			var text = person.firstName + " " + person.lastName;
			if(person.birthdate) {
				text += " (" + getAge(new Date(person.birthdate)) + ")";
			}

			var li = XI.create("li", {
				data: {id: personIds[i]},
				class: "person-list-item",
				text: text,
				appendTo: listItems
			});

			person.li = li;
		}

		list.innerHTML="";
		list.appendChild(listItems);
	}

	function setOnChange(callback) {
		selectedChangedCallback = callback;
	}



	function filterPersons(e) {
		//console.log("filter", e.type, txtFilter.value, e);
		var words = txtFilter.value.split(" ");

		for(var id in persons) {
			var person = persons[id];
			var show = true;
			var personStr = (person.firstName + " " + person.lastName).toLowerCase();

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


	return {
		update: update,
		onChange: setOnChange
	}
}());