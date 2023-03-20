// Variables & targets
const 	alertDiv = document.querySelector('.alert');
const 	form = document.querySelector('#form');
const 	input = document.querySelector('#input');
let 	submitBtn = document.querySelector('#submit-btn')
const 	tblContainer = document.querySelector('.table-container');
const 	listContainer = document.querySelector('.list-container');
const 	listItem = document.querySelectorAll('.list-item');
const 	clearBtn = document.querySelector('#clear-btn');
const 	localStorageKey = 'list';

let 	editFlag = false;
let 	editID = '';
let 	editElement;
submitBtn.innerHTML = `<i class="fas fa-plus"></i> Add`;

// FUNCTIONS:

// 1. Alert
function alert(alert, type) {

	alertDiv.innerHTML = alert;
	alertDiv.classList.add('alert-' + type);
	alertDiv.classList.remove('hide');

	setTimeout(function(){

		alertDiv.classList.add('hide');
		alertDiv.classList.remove('alert-' + type);

	}, 5000);
}

// 2. render Item
function renderItem(id, value, date) {

	let tr = document.createElement('tr');
	tr.setAttribute('data-id', id);
	tr.classList.add('list-item');
	
		let td1 = document.createElement('td');
			let input = document.createElement('input');
			input.classList.add('form-check-input', 'checkbox-row');
			input.setAttribute('type', 'checkbox');
			input.setAttribute('value', id);
			td1.appendChild(input);
			tr.appendChild(td1);

		let td2 = document.createElement('td');
			td2.innerHTML = value;
			tr.appendChild(td2);

		let td5 = document.createElement('td');
			td5.innerHTML = date;
			tr.appendChild(td5);

		let td3 = document.createElement('td');
			let btn1 = document.createElement('button');
			btn1.setAttribute('type', 'button');
			btn1.setAttribute('id', 'edit-' + id);
			btn1.classList.add('btn', 'btn-sm', 'btn-edit');
			let i1 = document.createElement('i');
			i1.classList.add('fas', 'fa-edit');
			btn1.appendChild(i1);
			td3.appendChild(btn1);
			tr.appendChild(td3);

		let td4 = document.createElement('td');
			let btn2 = document.createElement('button');
			btn2.setAttribute('type', 'button');
			btn2.setAttribute('id', 'delete-' + id);
			btn2.classList.add('btn', 'btn-sm', 'btn-delete');
			let i2 = document.createElement('i');
			i2.classList.add('fas', 'fa-trash');
			btn2.appendChild(i2);
			td4.appendChild(btn2);
			tr.appendChild(td4);

	listContainer.insertBefore(tr, listContainer.firstChild);

	// Event listeners (list items only):

	// 1. edit
	const editBtn = document.querySelector('#edit-' + id);
	editBtn.addEventListener('click', editItem);

	// 2. delete
	const deleteBtn = document.querySelector('#delete-' + id);
	deleteBtn.addEventListener('click', deleteItem);

	return tr;
}

// 3. check list
function checkList() {

	let totalItems = listContainer.children.length;

	totalItems ? tblContainer.classList.remove('hide') : tblContainer.classList.add('hide');
}

// 4. Clear list
function clearList() {

	let listItem = document.querySelectorAll('.list-item');

	let totalItems = listItem.length;

	if(totalItems > 0) {

		listItem.forEach(function(child) {

			listContainer.removeChild(child);

			let id = child.dataset.id;

			removeFromLocalStorage(id);

		});
	}

	alert('List cleared successfully', 'success');

	// check list, if empty collapse the list and hide
	checkList();
	resetForm();
}

// 5. If submit button is clicked
function submitBtnClicked(e) {

	e.preventDefault(); // prevent form submission by browser

	let value = input.value;

	if(value && !editFlag) { // add a item
		
		const id = new Date().getTime().toString();

		const day = new Date().getDate();
		const month = new Date().getMonth();
		const year = new Date().getFullYear();
		const date = year+'-'+month+'-'+day;

		let tr = renderItem(id, value, date);

		setTimeout(function() {

			tr.classList.add('table-secondary');

		}, 1);

		setTimeout(function() {

			tr.classList.remove('table-secondary');

		}, 3000);

		// add to local storage
		addToLocalStorage(id, value, date);

		// alert
		alert('<strong>' + value + '</strong> added successfully', 'success');

		// check list, if empty collapse the list and hide
		checkList();
		resetForm();
	
	} else if(value && editFlag) { // edit item
		
		editElement.textContent = value;

		alert('<strong>'+value+'</strong> updated successfully', 'success');

		let parent = editElement.parentElement;

		parent.classList.add('table-secondary');

		setTimeout(function(){

			parent.classList.remove('table-secondary');

		}, 4000);

		updateLocalStorage(editID, value);
		resetForm();

	} else { // empty field

		alert('Please fill the form', 'danger');
	} 
}

// 6. Edit item
function editItem(e) {
	
	editFlag = true;
	editID = e.currentTarget.parentElement.parentElement.dataset.id;
	editElement = e.currentTarget.parentElement.parentElement.firstChild.nextSibling;
	input.value = editElement.textContent;
	input.classList.add('text-primary', 'border-primary');
	submitBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
	submitBtn.classList.replace('btn-secondary', 'btn-primary');
}

// 7. Delete item
function deleteItem(e) {

	let element = e.currentTarget.parentElement.parentElement;
	element.parentElement.removeChild(element);

	id = element.dataset.id;

	// remove from local storage
	removeFromLocalStorage(id);

	alert('Item removed successfully', 'success');

	checkList(); // check list, if empty collapse the list and hide
	resetForm(); // reset form
}

// 8. Reset form
function resetForm() {

	editFlag = false;
	editID = '';
	editElement = null;
	input.value = '';
	input.classList.remove('text-primary', 'border-primary');
	submitBtn.innerHTML = `<i class="fas fa-plus"></i> Add`;
	submitBtn.classList.replace('btn-primary', 'btn-secondary');
}

// LOCAL STORAGE:

// 1. Add to local storage
function addToLocalStorage(id, value, date) {

	let newArray = {id: id, value: value, date: date};

	let currentArray = getLocalStorage();

	currentArray.push(newArray);

	localStorage.setItem(localStorageKey, JSON.stringify(currentArray));
}

// 2. Remove from local storage
function removeFromLocalStorage(id){

	let currentArray = getLocalStorage();

	newArray = currentArray.filter(function(item) {

		if(item.id !== id) {

			return item;
		}
	});

	localStorage.setItem(localStorageKey, JSON.stringify(newArray));
}

// 3. Update local storage
function updateLocalStorage(id, value) {

	let currentArray = getLocalStorage();

	let newArray = currentArray.map(function(item) {

		if(item.id === id) {

			item.value = value;
		}

		return item;
	});

	localStorage.setItem(localStorageKey, JSON.stringify(newArray));
}

// 3. Get local storage array
function getLocalStorage() {

	return localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : [];
}

// 4. Get items from local storage to interface
function getItemsFromStorageToInterface() {

	let items = getLocalStorage();

	if(items.length > 0) {

		items.forEach(function(item) {

			renderItem(item.id, item.value, item.date);

		});
	}

	checkList();
	
}

// EVENT LISTENERS:

// 1. If form is submitted
form.addEventListener('submit', submitBtnClicked);

// 2. If the clear list btn is clicked
clearBtn.addEventListener('click', clearList);

// 3. When page loads
window.addEventListener('DOMContentLoaded', getItemsFromStorageToInterface);

// RUN:

// 1. Check list
checkList();
