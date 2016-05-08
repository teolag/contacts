"use strict";

var PersonEdit = (function() {
	var pop;
	var tplPersonEdit = XI.selectId("tplPersonEdit");


	function newPerson() {
		var content = tplPersonEdit.content;
		var h1 = content.querySelector("h1");
		h1.textContent = "New person";

		pop = XioPop.showElement({
			element: document.importNode(content, true)
		});

		var btnCancel = XI.selectId("btnCancelPersonEdit");
		btnCancel.addEventListener("click", cancelEditPerson, false);

		var form = pop.box.querySelector("form");
		form.addEventListener("submit", savePerson, false);
	}

	function editPerson(e) {
		var personId = e.target.dataset.personId;
		var person = persons[personId];

		var content = tplPersonEdit.content;
		var h1 = content.querySelector("h1");
		h1.textContent = "Edit person";

		var form = content.querySelector("form");
		var inputs = form.elements;

		inputs.personId.value = personId;
		inputs.firstName.value = person.firstName;
		inputs.lastName.value = person.lastName;
		if(person.birthdate) {
			inputs.birthdate.value = person.birthdate.substr(0,10);
		}

		pop = XioPop.showElement({
			element: document.importNode(content, true)
		});

		var form = pop.box.querySelector("form");
		form.addEventListener("submit", savePerson, false);
	}

	function savePerson(e) {
		XI.postForm(e.target, {
			callback: submitPersonCallback
		});
		e.preventDefault();

		function submitPersonCallback(data) {
			console.log("submitPersonCallback", e);
			persons[data.person.id][firstName] = data.person.firstName;
			persons[data.person.id][lastName] = data.person.lastName;
			PersonList.update();
			pop.close();
		}
	}

	function cancelEditPerson() {
		pop.close();
	}



	return {
		edit: editPerson,
		new: newPerson
	}
}());