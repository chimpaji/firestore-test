const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");
const editForm = document.querySelector("#edit-cafe-form");
const editSubmitButton = document.querySelector("#edit-submit-button");
let selectedId;

//create element and render cafe
function renderCafe(doc) {
	let li = document.createElement("li");
	let name = document.createElement("span");
	let city = document.createElement("span");
	let cross = document.createElement("div");
	let edit = document.createElement("button");

	li.setAttribute("city-id", doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	cross.textContent = "x";
	edit.textContent = "edit";

	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);
	li.appendChild(edit);

	cafeList.appendChild(li);

	cross.addEventListener("click", (e) => {
		let id = cross.parentElement.getAttribute("city-id");
		db.collection("cafes").doc(id).delete();
	});

	//edit data
	edit.addEventListener("click", (e) => {
		let id = edit.parentElement.getAttribute("city-id");
		selectedId = id;
		let name = document.querySelector(`[city-id=${id}]`).children[0]
			.textContent;
		let city = document.querySelector(`[city-id=${id}]`).children[1]
			.textContent;
		// let city = document.querySelector(
		// 	`[city-id=${id}]:nth-child(2)`
		// ).textContent;
		// db.collection("cafes").doc(id).delete();
		editForm.name.value = name;
		editForm.city.value = city;
	});
}

//getting data

// db.collection("cafes")
// 	.get()
// 	.then((snapshot) => snapshot.docs.forEach((doc) => renderCafe(doc)));

//saving data
form.addEventListener("submit", (e) => {
	e.preventDefault();
	db.collection("cafes").add({
		name: form.name.value,
		city: form.city.value,
	});
	form.name.value = "";
	form.city.value = "";
});

//editing data
editForm.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log(selectedId);
	db.collection("cafes")
		.doc(selectedId)
		.update({ name: editForm.name.value, city: editForm.city.value });
	// db.collection("cafes").doc();
	editForm.name.value = "";
	editForm.city.value = "";
});

//real-time listener

db.collection("cafes")
	.orderBy("name")
	.onSnapshot((snapshot) => {
		console.log("snapshot: ", snapshot);
		cafeList.innerHTML = "";
		snapshot.docs.forEach((doc) => {
			console.log("doc: ", doc);
			renderCafe(doc);
		});
		// console.log("snapshot: ", snapshot);
		// let changes = snapshot.docChanges();
		// changes.forEach((change) => {
		// 	console.log("change: ", change);
		// 	if (change.type === "added" || change.type === "modified") {
		// 		renderCafe(change.doc);
		// 	} else if (change.type === "removed") {
		// 		let li = document.querySelector(`[city-id=${change.doc.id}]`);
		// 		cafeList.removeChild(li);
		// 	}
		// });
	});
