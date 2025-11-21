// les varaibles sidbar;
let addWorkerBtn = document.getElementById("addWorkerBtn");
let unassignedStaffList = document.getElementById("unassignedStaffList");
let addExperienceBtn = document.getElementById("addExperienceBtn");
let employeeForm = document.getElementById("employeeForm");
let addEmployerBtn = document.getElementById("addEmployerBtn");
let employeeProfileModal = document.getElementById("employeeProfileModal");
// les varaibles main
let btnAddZone = document.getElementsByClassName("btn-add");
let btnZoneContent = document.getElementsByClassName("btn-add");
// les arrayers
var workers = {};
var experiences = [];
const workerKy = "worker";

var idMd;

// localStorage.removeItem(workerKy)
// les cours des fonctions
function getData() {
  let employe = localStorage.getItem(workerKy);
  return employe ? JSON.parse(employe) : [];
}
function saveData(employe) {
  let employes = getData();
  employes.push(employe);
  localStorage.setItem(workerKy, JSON.stringify(employes));
}
function openModalWorker() {
  let addEmployeeModal = (document.getElementById(
    "addEmployeeModal"
  ).style.display = "block");
}
function closeModalworker() {
  let addEmployeeModal = (document.getElementById(
    "addEmployeeModal"
  ).style.display = "none");
  let spans = employeeForm.querySelectorAll("span");
  spans.forEach((span) => {
    span.remove();
  });
  employeeForm.reset();
  experiences = [];
}
function openProfileModal() {
  employeeProfileModal.style.display = "block";
}
function closeProfileModal() {
  employeeProfileModal.style.display = "none";
}
function ModalAddExperience() {
  let experiencesContainer = document.getElementById("experiencesContainer");
  let experience = experiencesContainer.querySelector("textarea");
  let dateInputStart = experiencesContainer.querySelector("#dateStart").value;
  let dateInputEnd = experiencesContainer.querySelector("#dateEnd").value;
  let validTime = testTime(dateInputStart, dateInputEnd);
  if (validTime) {
    if (
      !experience.value ||
      !experience.value.trim() ||
      experiences.includes(experience.value.trim().toLowerCase())
    )
      return;

    experiences.push(experience.value);
    displayExperience(experience.value);

    experience.value = "";
  }
}
function displayExperience(experience) {
  let contentExperience = document.getElementById("content-experience");
  const span = document.createElement("span");
  span.className = "span-experience";
  span.innerHTML = `
        ${experience ? experience : ""}
        <button 
            type="button" 
            class="remove-experience-btn"
            aria-label="Remove ${experience ? experience : ""}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>`;
  contentExperience.appendChild(span);
  removespan(span);
}

function removespan(span) {
  span.querySelector(".remove-experience-btn").addEventListener("click", () => {
    setTimeout(() => span.remove(), 200);
    let filtreExperience = [];
    filtreExperience = experiences.filter(
      (ex) => ex !== span.textContent.trim().toLowerCase()
    );
    experiences = filtreExperience;
    console.log(experiences);
  });
}
function testTime(debut, fin) {
  if (debut < fin) {
    return true;
  } else {
    alert("la date de debut doit etre plus de date de fin");
    return false;
  }
}
function ModalAddEmployer(event = null) {
  if(errorValidat()){
  if (event) event.preventDefault();
  let inputs = employeeForm.querySelectorAll("input, select");
  let newEmploye = {
    id: Date.now(),
    experiences: experiences,
  };
  console.log(experiences);
  inputs.forEach((input) => {
    if (input.name && input.name !== "experiences") {
      newEmploye[input.name] = input.value;
    }
  });
  saveData(newEmploye);
  console.log(getData());
  experiences = [];
  displayWorker();
  closeModalworker();
   }else{
    return;
   }
}
function displayPhoto(e) {
  let urlPhoto = e.target.value;
  let photoPreview = document.getElementById("photoPreview");
  photoPreview.innerHTML = `<img src="${urlPhoto}" alt="profil">`;
}

function displayWorker() {
  let unassignedStaffList = document.getElementById("unassignedStaffList");
  if (!unassignedStaffList) {
    console.error("Element 'unassignedStaffList' non trouve");
    return;
  }
  unassignedStaffList.innerHTML = "";
  const workers = getData();
  if (!workers || workers.length === 0) {
    unassignedStaffList.innerHTML = "<p>Aucun employe a afficher</p>";
    return;
  }
  let employes = getData();
  employes.forEach((worker) => {
    let divlist = document.createElement("div");
    divlist.className = "card-worker";
    divlist.innerHTML = `
  <div class="photo-preview"><img src="${worker.photo}" alt="${worker.name}"></div>
  <div class="name-preview"data-id='${worker.id}'><p>${worker.name}</p><p>${worker.role}</p></div>
  <div class="btn-card">
  <button  class="btn-del-experience" id="deleteBtn"data-id='${worker.id}'><img width="30" height="25" src="https://img.icons8.com/ios-filled/50/remove-administrator.png" alt="remove-administrator"/></button> 
   <button  class="btn-upd-experience" id="updateBtn"data-id='${worker.id}'><img width="30" height="25" src="https://img.icons8.com/ios-filled/50/edit-administrator.png" alt="edit-administrator"/></button></div>`;
    // <img width="30" height="20" src="https://img.icons8.com/scribby/50/filled-trash.png" alt="filled-trash"/>
    // <img width="30" height="20" src="https://img.icons8.com/fluency/48/edit-text-file.png" alt="edit-text-file"/>
    unassignedStaffList.appendChild(divlist);
  });
  addEventListeners();
}
function addEventListeners() {
  document.querySelectorAll(".name-preview").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      displayProfil(workerId);
    });
  });
  document.querySelectorAll(".btn-del-experience").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      deleteWorker(workerId);
    });
  });

  document.querySelectorAll(".btn-upd-experience").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      updateWorker(workerId);
    });
  });
}

function deleteWorker(id) {
  let conf = confirm("se vuex supprimer ce employe");
  if (conf) {
    let employes = getData();
    let newEpmloyes = employes.filter((emp) => emp.id != id);
    console.log(newEpmloyes);
    localStorage.setItem(workerKy, JSON.stringify(newEpmloyes));
    displayWorker();
  } else {
    return;
  }
}

function updateWorker(id) {
  openModalWorker();
  idMd = id;
  let employes = getData();
  let newEpmloye = employes.find((emp) => emp.id == id);
  document.getElementById("employeeName").value = newEpmloye.name;
  document.getElementById("employeeRole").value = newEpmloye.role;
  document.getElementById("employeeEmail").value = newEpmloye.email;
  document.getElementById("employeePhone").value = newEpmloye.phone;
  document.getElementById("employeePhoto").value = newEpmloye.photo;
  document.getElementById("dateStart").value = newEpmloye.dateExeperienceStart;
  document.getElementById("dateEnd").value = newEpmloye.dateExeperienceEnd;
  newEpmloye.experiences.forEach((exp) => {
    displayExperience(exp);
    console.log(exp);
  });
  addEmployerBtn.innerHTML = "Modifier";
}
function displayProfil(id) {
  openProfileModal();
  console.log(id);
  let employes = getData();
  console.log(employes);
  let newEpmloye = employes.find((emp) => emp.id == id);
  console.log(newEpmloye.name);
  console.log(newEpmloye);
  document.getElementById("profileName").innerHTML = newEpmloye.name;
  document.getElementById("profileRole").innerHTML = newEpmloye.role;
  document.getElementById("profileEmail").innerHTML = newEpmloye.email;
  document.getElementById("profilePhone").innerHTML = newEpmloye.phone;
  console.log(newEpmloye.photo);
  document.getElementById("profilePhoto").src = newEpmloye.photo;
  document.getElementById("dateStart").innerHTML =
    newEpmloye.dateExeperienceStart;
  document.getElementById("dateEnd").innerHTML = newEpmloye.dateExeperienceEnd;
  let experience = document.getElementById("profileExperiences");
  experience.innerHTML = "";
  newEpmloye.experiences.forEach((exp) => {
    let li = document.createElement("li");
    li.innerHTML = `${exp}`;
    experience.appendChild(li);
    console.log(exp);
  });
}

// la fonction principale
function appInit() {
  let employeeForm = document.getElementById("employeeForm");

  employeeForm.addEventListener("submit", ModalAddEmployer);
  addEmployerBtn.addEventListener("click", () => {
    if (addEmployerBtn.innerHTML === "Modifier") {
      ModalAddEmployer();
      deleteWorker(idMd);
      addEmployerBtn.innerHTML = "Ajouter l'employer";
    }
  });
  addWorkerBtn.addEventListener("click", openModalWorker);
  document
    .getElementById("closeProfileModalBtn")
    .addEventListener("click", closeProfileModal);
  let closeModalBtn = document.getElementById("closeModalBtn");
  closeModalBtn.addEventListener("click", closeModalworker);

  let inputPhoto = document.getElementById("employeePhoto");
  inputPhoto.addEventListener("change", displayPhoto);

  let addExperienceBtn = document.getElementById("addExperienceBtn");
  addExperienceBtn.addEventListener("click", ModalAddExperience);
}

console.log(getData());
document.addEventListener("DOMContentLoaded", () => {
  console.log(setTimeout(() => Date.now(), 0));
  console.log(setTimeout(() => Date.now(), 0));
  console.log(setTimeout(() => Date.now(), 0));
  displayWorker();
  appInit();
});
