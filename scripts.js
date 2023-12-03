function GEBID(id) {
	return document.getElementById(id);
}

function CE(elemnt) {
	return document.createElement(elemnt);
}

function addClass(el, classname) {
	if(el.className.indexOf(classname) < 0) {
		el.className = el.className + ' ' + classname;
		el.className = el.className.trim();
	}
}

function removeClass(el, classname) {
	el.className = el.className.replace(classname, '').trim();
}

function showToast(msg, toastClass) {
	taskToast.innerText = msg;
	
	addClass(taskToast, toastClass);
	
	taskToast.style.bottom = '1rem';
	
	window.setTimeout(hideToast, 3000);
}

function hideToast() {
	taskToast.removeAttribute('style');
	
	window.setTimeout(resetToast, 500);
}

function resetToast() {
	removeClass(taskToast, 'text-green');
	
	removeClass(taskToast, 'text-blue');
	
	removeClass(taskToast, 'text-red');
	
	taskToast.innerText = null;
}

const toggleCheckbox = document.getElementById('toggle-checkbox');
const taskSearch = GEBID('task-search');
const taskInputForm = GEBID('task-input-form');
const taskInput = GEBID('task-input');
const taskList = GEBID('task-list');
const taskToast = document.getElementById('task-toast');

let taskCount = 0;
let remainingTasks = [];

window.addEventListener('DOMContentLoaded', fillRemainingTasks);
toggleCheckbox.addEventListener('change', toggleSearchField);
taskSearch.addEventListener('keyup', searchTasks);
taskInputForm.addEventListener('submit', processTaskInputForm);

function fillRemainingTasks() {
	if(localStorage.length > 0) {
		for(let item = 0; item < localStorage.length; item++) {
			let itemKey = localStorage.key(item);
			
			if(itemKey.indexOf('task') > -1) {
				remainingTasks.push(itemKey);
			}
		}
		
		remainingTasks.sort();
		
		for(let index = 0; index < remainingTasks.length; index++) {
			let taskKey = 'task' + ++taskCount;
			let itemKey = remainingTasks[index];
			let itemDetails = localStorage.getItem(itemKey);
			
			createTask(taskKey, itemDetails);
			
			localStorage.removeItem(itemKey);
				
			localStorage.setItem(taskKey, itemDetails);
		}
	} 
}

function toggleSearchField() {
	if(toggleCheckbox.checked) {
		removeClass(taskSearch, 'hide');
		taskSearch.focus();
	} else {
		addClass(taskSearch, 'hide');
	}
}

function processTaskInputForm(event) {
	event.preventDefault();
	
	let taskID = 'task' + ++taskCount;
	
	createTask(taskID, taskInput.value);
	
	localStorage.setItem(taskID, taskInput.value);
	
	showToast('Successfully added a new task.', 'text-green');
	
	taskInputForm.reset();
}

function createTask(taskKey, taskDetails) {
	let taskListItem = CE('li');
	let taskSpan = CE('span');
	let taskActions = CE('div');
	let taskEdit = CE('button');
	let taskDelete = CE('button');
	
	taskListItem.className = 'task-item';
	taskActions.className = 'task-actions';
	taskEdit.className = 'task-button task-edit';
	taskDelete.className = 'task-button task-delete';
	
	taskSpan.className = 'task';
	taskSpan.id = taskKey;
	
	taskEdit.type = 'button';
	taskDelete.type = 'button';
	
	taskSpan.innerText = taskDetails;
	taskEdit.innerHTML = '&#9998;';
	taskDelete.innerHTML = '&times;';
	
	taskSpan.addEventListener('keypress', updateTask);
	taskSpan.addEventListener('blur', saveTask);
	taskEdit.addEventListener('click', editTask);
	taskDelete.addEventListener('click', deleteTask);
	
	taskListItem.appendChild(taskSpan);
	taskListItem.appendChild(taskActions);
	taskActions.appendChild(taskEdit);
	taskActions.appendChild(taskDelete);
	taskList.appendChild(taskListItem);
}

function updateTask(evnt) {
	if(evnt.keyCode == 13) {
		saveTask.call(evnt.target);
	}
}

function saveTask() {
	this.removeAttribute('contenteditable');
	localStorage.setItem(this.id, this.innerText);
	showToast('Successfully saved a task.', 'text-blue');
}

function editTask() {
	this.parentElement.previousElementSibling.setAttribute('contenteditable', 'true');
	this.parentElement.previousElementSibling.focus();
}

function deleteTask() {
	localStorage.removeItem(this.parentElement.previousElementSibling.id);
	taskList.removeChild(this.parentElement.parentElement);
	showToast('Successfully deleted a task.', 'text-red');
}

function searchTasks() {
	let searchQuery = this.value.toLowerCase();
	let tasks = document.getElementsByClassName('task');
	
	for(let t = 0; t < tasks.length; t++) {
		let taskListItem = tasks[t].parentElement;
		
		if(searchQuery.length > 0) {
			addClass(taskListItem, 'hide');
			
			if(tasks[t].innerText.toLowerCase().indexOf(searchQuery) > -1) {
				removeClass(taskListItem, 'hide');
			}
		} else {
			removeClass(taskListItem, 'hide');
		}
	}
}