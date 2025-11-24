// les varaibles sidbar;
let addWorkerBtn = document.getElementById("addWorkerBtn");
let unassignedStaffList = document.getElementById("unassignedStaffList");
let addExperienceBtn = document.getElementById("addExperienceBtn");
let employeeForm = document.getElementById("employeeForm");
let addEmployerBtn = document.getElementById("addEmployerBtn");
let employeeProfileModal = document.getElementById("employeeProfileModal");
let conferenceStaff = document.getElementById("conference-staff");
let eligibleEmployeesList = document.getElementById("eligibleEmployeesList");
let zoneAssignmentModal = document.getElementById("zoneAssignmentModal");
  let photoPreview = document.getElementById("photoPreview");
// les varaibles main
let btnAddZone = document.getElementsByClassName("btn-add");
let containerZone = {
  conference: [],
  security: [],
  staff: [],
  reception: [],
  server: [],
  archive: [],
};
const ACCESS_RULES = {
  reception: ["Receptionniste", "manager"],
  server: ["technician", "manager"],
  security: ["security", "manager"],
  archive: ["manager"],
};

const ROLE_RESTRICTIONS = {
  Nettoyage: ["archive"],
};

const ZONE_CAPACITIES = {
  conference: 8,
  reception: 2,
  server: 3,
  security: 4,
  staff: 6,
  archive: 2,
};
let idMd;
// les arrayers
let workers = {};
var experiences = [];
const workerKy = "worker";
const dataZone = "dataZone";
// localStorage.removeItem(dataZone);
// localStorage.removeItem(workerKy);
function initializeDataZone() {
  if (!localStorage.getItem(dataZone)) {
    localStorage.setItem(dataZone, JSON.stringify(containerZone));
  }
}
function errorValidat() {
  const name = document.getElementById("employeeName");
  const role = document.getElementById("employeeRole");
  const email = document.getElementById("employeeEmail");
  const phone = document.getElementById("employeePhone");
  name.style.border = "";
  role.style.border = "";
  email.style.border = "";
  phone.style.border = "";
  removeErrorMessages();
  const validations = {
    name: /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/.test(name.value.trim()),
    role: /^(other|Nettoyage|security|technician|Receptionniste|manager)$/.test(
      role.value
    ),
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value),
    phone: /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}$/.test(phone.value),
  };

  const errorMessages = {
    name: "Le nom doit contenir 2 a 50 caracteres alphabetiques",
    role: "Veuillez selectionner un role valide",
    email: "Format d'email invalide (ex: exemple@domaine.com)",
    photo: "URL ou nom de fichier image invalide (jpg, jpeg, png, gif, webp)",
    phone:
      "Format de telephone français invalide (ex: 0123456789 ou +33123456789)",
  };

  let isValid = Object.values(validations).every((valid) => valid);
  if (isValid) {
    return true;
  } else {
    if (!validations.name) {
      showError(name, errorMessages.name);
    }
    if (!validations.role) {
      showError(role, errorMessages.role);
    }
    if (!validations.email) {
      showError(email, errorMessages.email);
    }
    if (!validations.phone) {
      showError(phone, errorMessages.phone);
    }
    return false;
  }
}
function showError(input, message) {
  input.style.border = "1px solid red";
  const errorElement = document.createElement("span");
  errorElement.className = "error-message";
  errorElement.style.color = "red";
  errorElement.style.fontSize = "12px";
  errorElement.style.display = "block";
  errorElement.style.marginTop = "5px";
  errorElement.textContent = message;
  input.parentNode.appendChild(errorElement);
}
function removeErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());
}
function getData() {
  let employe = localStorage.getItem(workerKy);
  return employe ? JSON.parse(employe) : [];
}
function saveData(employe) {
  let employes = getData();
  employes.push(employe);
  localStorage.setItem(workerKy, JSON.stringify(employes));
}
function getDataZone() {
  initializeDataZone();
  let employe = localStorage.getItem(dataZone);
  return employe ? JSON.parse(employe) : containerZone;
}
function saveDataZone(data) {
  localStorage.setItem(dataZone, JSON.stringify(data));
}
function canAssignToZone(workerRole, targetZone) {
  if (workerRole === "manager") return true;
  if (ROLE_RESTRICTIONS[workerRole]?.includes(targetZone)) {
    return false;
  }
  const allowedRoles = ACCESS_RULES[targetZone];
  if (allowedRoles) {
    return allowedRoles.includes(workerRole);
  }
  return true;
}
function isZoneFull(zoneId) {
  const zones = getDataZone();
  return zones[zoneId].length >= ZONE_CAPACITIES[zoneId];
}
function findEmployeeLocation(employeeId) {
  const zones = getDataZone();
  for (const [zoneName, employees] of Object.entries(zones)) {
    if (employees.find((emp) => emp.id == employeeId)) {
      return getZoneDisplayName(zoneName);
    }
  }
  return "Non assigne";
}
function getZoneDisplayName(zoneId) {
  const zoneNames = {
    conference: "Salle de Conférence",
    reception: "Réception",
    server: "Salle des Serveurs",
    security: "Salle de Sécurité",
    staff: "Salle du Personnel",
    archive: "Salle d'Archives",
  };
  return zoneNames[zoneId] || zoneId;
}
function openModalWorker() {
  let addEmployeeModal = (document.getElementById(
    "addEmployeeModal"
  ).style.display = "block");
  photoPreview.innerHTML="";
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
  removeErrorMessages();
}
function openProfileModal() {
  employeeProfileModal.style.display = "block";
}
function closeProfileModal() {
  employeeProfileModal.style.display = "none";
}
function closemodalAssignment() {
  document
    .getElementById("closeAssignmentModalBtn")
    .addEventListener("click", () => {
      zoneAssignmentModal.style.display = "none";
    });
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
  if (event) event.preventDefault();
  if (errorValidat()) {
    let inputs = employeeForm.querySelectorAll("input, select");
    let newEmploye = {
      id: Date.now(),
      experiences: experiences,
    };
    inputs.forEach((input) => {
      if (input.name && input.name !== "experiences") {
        newEmploye[input.name] = input.value;
      }
    });
    saveData(newEmploye);
    experiences = [];
    displayWorker();
    closeModalworker();
  } else {
    return false;
  }
}
function displayPhoto(e) {
  let urlPhoto = e.target.value;
    photoPreview.innerHTML = `<img src="${urlPhoto}" alt="profil" onerror="this.style.display='none'">`;
}
function displayWorker() {
  let unassignedStaffList = document.getElementById("unassignedStaffList");
  const workers = getData();
  const zones = getDataZone();
  const assignedIds = new Set();
  Object.values(zones).forEach((zoneEmployees) => {
    zoneEmployees.forEach((emp) => assignedIds.add(emp.id));
  });
  const unassignedWorkers = workers.filter(
    (worker) => !assignedIds.has(worker.id)
  );
  if (!unassignedWorkers || unassignedWorkers.length === 0) {
    unassignedStaffList.innerHTML =
      "<p class='empty-zone'>Aucun employe non assigne</p>";
    return;
  }
  unassignedStaffList.innerHTML = "";
  unassignedWorkers.forEach((worker) => {
    unassignedStaffList.appendChild(displaySpan(worker));
  });
}
function displayCardsWorker(role) {
  zoneAssignmentModal.style.display = "block";
  eligibleEmployeesList.innerHTML = "";
  let workers = getData();
  let zones = getDataZone();
  const assignedIds = new Set();
  Object.values(zones).forEach((zoneEmployees) => {
    zoneEmployees.forEach((emp) => assignedIds.add(emp.id));
  });
  const eligibleWorkers = workers.filter(
    (worker) =>
      !assignedIds.has(worker.id) && canAssignToZone(worker.role, role)
  );
  if (eligibleWorkers.length === 0) {
    eligibleEmployeesList.innerHTML =
      "<p class='empty-zone'>Aucun employe eligible disponible</p>";
  } else {
    eligibleWorkers.forEach((worker) => {
      eligibleEmployeesList.appendChild(assignmentSpan(worker, role));
    });
  }
  closemodalAssignment();
}
function displaySpan(worker) {
  let divlist = document.createElement("div");
  divlist.className = "card-worker";
  divlist.innerHTML = `
  <div class="photo-preview"><img src="${worker.photo}" alt="${worker.name}"></div>
  <div class="name-preview"data-id='${worker.id}'><p>${worker.name}</p><p>${worker.role}</p></div>
  <div class="btn-card">
  <button  class="btn-del-experience" id="deleteBtn"data-id='${worker.id}'><img width="30" height="20" src="https://img.icons8.com/scribby/50/filled-trash.png" alt="filled-trash"/></button> 
   <button  class="btn-upd-experience" id="updateBtn"data-id='${worker.id}'><img width="30" height="20" src="https://img.icons8.com/fluency/48/edit-text-file.png" alt="edit-text-file"/></button></div>`;
  return divlist;
}
function assignmentSpan(worker, role) {
  let divlist = document.createElement("div");
  divlist.className = "card-worker";
  divlist.innerHTML = `
  <div class="photo-preview"><img src="${worker.photo}" alt="${worker.name}"></div>
  <div class="name-preview"data-id='${worker.id}'><p>${worker.name}</p><p>${worker.role}</p></div>
  <div class="btn-card">
   <button  class="btn-add-zone" role="${role}"data-id='${worker.id}'><img width="24" height="24" src="https://img.icons8.com/softteal-gradient/24/add.png" alt="add"/></button>
   </div>`;
  return divlist;
}
function assignmentZone(workers) {
  let divlist = document.createElement("div");
  divlist.className = "card-zone";
  let worker = Array.isArray(workers) ? workers[0] : workers;
  if (worker && worker.id) {
    divlist.innerHTML = `
  <div class="photo-zone"><img src="${worker.photo}" alt="${worker.name}"></div>
  <div class="name-preview"data-id='${worker.id}'><p>${worker.name}</p><p>${worker.role}</p></div>
  <div class="btn-card">
   <button  class="btn-add-card"id='${worker.id}'>✕</button>
   </div>`;
  } else {
    divlist.innerHTML = `<div class="empty-zone">Aucun employe</div>`;
  }
  return divlist;
}
function addCardAssignment(workerId, role) {
  let employes = getData();
  let employe = employes.find((emp) => emp.id == workerId);
  if (!employe) {
    console.error("Employe non trouve");
    return;
  }
  if (!canAssignToZone(employe.role, role)) {
    return false;
  }
  if (isZoneFull(role)) {
    return false;
  }
  let zones = getDataZone();
  Object.keys(zones).forEach((zone) => {
    zones[zone] = zones[zone].filter((emp) => emp.id != workerId);
  });

  if (zones.hasOwnProperty(role)) {
    zones[role].push(employe);
    saveDataZone(zones);
    updateZoneDisplay(role);
    displayWorker();
    return true;
  } else {
    console.error(`Zone ${role} non reconnue`);
    return false;
  }
}
function removeCardAssignment(workerId) {
  let zones = getDataZone();
  let employeeRemoved = false;
  Object.keys(zones).forEach((zone) => {
    const initialLength = zones[zone].length;
    zones[zone] = zones[zone].filter((emp) => emp.id != workerId);
    if (zones[zone].length !== initialLength) {
      employeeRemoved = true;
    }
  });
  if (employeeRemoved) {
    saveDataZone(zones);
    updateAllZonesDisplay();
    displayWorker();
    removeCardAssignment();
  }
}

function enableDragAndDrop() {
  const draggables = document.querySelectorAll(".card-worker, .card-zone");
  const zones = document.querySelectorAll(
    ".zone-content, #unassignedStaffList"
  );

  draggables.forEach((emp) => {
    emp.setAttribute("draggable", true);

    emp.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", emp.dataset.id);
      emp.classList.add("dragging");
    });

    emp.addEventListener("dragend", () => {
      emp.classList.remove("dragging");
    });
  });

  zones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const empId = e.dataTransfer.getData("text/plain");
      const emp = document.querySelector(`[data-id='${empId}']`);
      if (!emp) return;

      const targetZoneId = zone.id.replace("-staff", "");
      const workerData = getData().find((w) => w.id == empId);
      if (!canAssignToZone(workerData.role, targetZoneId)) {
        alert("Ce rôle n'est pas autorisé dans cette zone");
        return;
      }
      if (isZoneFull(targetZoneId)) {
        alert("La zone est complète");
        return;
      }

      addCardAssignment(empId, targetZoneId);
    });
  });
}

function updateAllZonesDisplay() {
  const zones = [
    "conference",
    "reception",
    "server",
    "security",
    "staff",
    "archive",
  ];
  zones.forEach((zone) => updateZoneDisplay(zone));
   zoneObligatoir();
}
function updateZoneDisplay(zoneId) {
  let zones = getDataZone();
  let zoneElement = document.getElementById(`${zoneId}-staff`);
  if (!zoneElement) return;
  zoneElement.innerHTML = "";
  if (zones[zoneId] && zones[zoneId].length > 0) {
    zones[zoneId].forEach((worker) => {
      const card = assignmentZone(worker);
      zoneElement.appendChild(card)
   
    });
  } else {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-zone";
    emptyMessage.textContent = "Aucun employe affecte";
    zoneElement.appendChild(emptyMessage)
   
  }

  let zoneCounter = document.querySelector(
    `[data-zone="${zoneId}"] .zone-counter`
  );
  if (zoneCounter) {
    zoneCounter.textContent = `${zones[zoneId].length}/${ZONE_CAPACITIES[zoneId]}`;
  }
   zoneObligatoir();
}
function addEventListeners() {
  document.querySelectorAll(".zone-content").forEach((button) => {
    button.addEventListener("click", function () {
      updateAllZonesDisplay();
    });
  });
  document.querySelectorAll(".name-zone").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      const roleWorker = this.getAttribute("role");
      displayProfil(workerId, roleWorker);
    });
  });
  document.addEventListener("click", function (e) {
   
    if (e.target.closest(".name-preview")) {
      const workerId = e.target
        .closest(".name-preview")
        .getAttribute("data-id");
      displayProfil(workerId);
    }

    if (e.target.closest(".btn-del-experience")) {
      const workerId = e.target
        .closest(".btn-del-experience")
        .getAttribute("data-id");
      deleteWorker(workerId);
    }
    if (e.target.closest(".btn-upd-experience")) {
      const workerId = e.target
        .closest(".btn-upd-experience")
        .getAttribute("data-id");
      updateWorker(workerId);
    }
    if (e.target.closest(".btn-add-zone")) {
      const workerId = e.target
        .closest(".btn-add-zone")
        .getAttribute("data-id");
      const roleWorker = e.target
        .closest(".btn-add-zone")
        .getAttribute("role");
        addCardAssignment(workerId, roleWorker); 
        displayCardsWorker(roleWorker)  
    }
    if (e.target.closest(".btn-add")) {
      const zone = e.target.closest(".btn-add").getAttribute("data-zone");
      displayCardsWorker(zone);
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest(".btn-add-card")) {
      const button = e.target.closest(".btn-add-card");
      removeCardAssignment(button.id);
    
    }
  });
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchEmployees(searchInput.value);
    });
  }
}
function searchEmployees(query) {
  const lowerQuery = query.trim().toLowerCase();
  const allWorkers = getData();
  const results = allWorkers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(lowerQuery) ||
      worker.role.toLowerCase().includes(lowerQuery)
  );

  unassignedStaffList;
  if (!unassignedStaffList) return;

  unassignedStaffList.innerHTML = "";
  if (results.length === 0) {
    unassignedStaffList.innerHTML = "<p>Aucun employé trouvé</p>";
    return;
  }

  results.forEach((worker) => {
    unassignedStaffList.appendChild(displaySpan(worker));
  });
}
function removeCard(id) {
  let employes = getData();
  let newEpmloyes = employes.filter((emp) => emp.id != id);
  localStorage.setItem(workerKy, JSON.stringify(newEpmloyes));
  removeCardAssignment(id);
  displayWorker();
}
function deleteWorker(id) {
  let conf = confirm("se vuex supprimer ce employe");
  if (conf) {
    removeCard(id);
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
  document.getElementById(
    "photoPreview"
  ).innerHTML = `<img src="${newEpmloye.photo}" alt="profil" onerror="this.style.display='none'">`;
  document.getElementById("dateStart").value = newEpmloye.dateExeperienceStart;
  document.getElementById("dateEnd").value = newEpmloye.dateExeperienceEnd;
  newEpmloye.experiences.forEach((exp) => {
    displayExperience(exp);
  });
  addEmployerBtn.innerHTML = "Modifier";
}
function zoneObligatoir() {
  const zones = getDataZone();

  Object.keys(zones).forEach(zoneId => {
    let zoneElement = document.getElementById(`${zoneId}-staff`);

    if (!zoneElement) return;
   console.log(zoneId!=="conference")
    if (zones[zoneId].length === 0 && zoneId!='conference'&& zoneId!='staff') {
      zoneElement.style.backgroundColor = "#ffdddd"; 
      zoneElement.style.border = "1px solid #ff6b6b";
    } 
    else {
      zoneElement.style.backgroundColor = "";
      zoneElement.style.border = "";
    }
  });
}


function displayProfil(id, role = null) {
  openProfileModal();
  let employes = getData();
  let newEpmloye = employes.find((emp) => emp.id == id);

  if (!newEpmloye) {
    let data = getDataZone();
    for (const zone in data) {
      newEpmloye = data[zone].find((emp) => emp.id == id);
      if (newEpmloye) break;
    }
  }
  if (newEpmloye) {
    document.getElementById("profileName").innerHTML = newEpmloye.name;
    document.getElementById("profileRole").innerHTML = newEpmloye.role;
    document.getElementById("profileEmail").innerHTML = newEpmloye.email;
    document.getElementById("profilePhone").innerHTML = newEpmloye.phone;
    document.getElementById("profilePhoto").src = newEpmloye.photo;
    document.getElementById("profileLocation").textContent =
      findEmployeeLocation(id);
    let experience = document.getElementById("profileExperiences");
    experience.innerHTML = "";
    newEpmloye.experiences.forEach((exp) => {
      let li = document.createElement("li");
      li.innerHTML = `${exp}`;
      experience.appendChild(li);
    });
  }
}
// la fonction principale
function appInit() {
  let employeeForm = document.getElementById("employeeForm");

  employeeForm.addEventListener("submit", ModalAddEmployer);

  addEmployerBtn.addEventListener("click", (e) => {
    if (addEmployerBtn.innerHTML === "Modifier") {
      e.preventDefault();
      ModalAddEmployer();
      removeCard(idMd);
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
  inputPhoto.addEventListener("input", displayPhoto);

  let addExperienceBtn = document.getElementById("addExperienceBtn");
  addExperienceBtn.addEventListener("click", ModalAddExperience);
   let Btn = document.getElementById("reception-staff");
  Btn.addEventListener("change", zoneObligatoir);
}

document.addEventListener("DOMContentLoaded", () => {
  displayWorker();
  appInit();
  initializeDataZone();
  updateAllZonesDisplay();
  enableDragAndDrop();
  addEventListeners();
 
});