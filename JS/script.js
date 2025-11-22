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
console.log(eligibleEmployeesList);
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
    'reception': ['Receptionniste', 'manager'],
    'server': ['technician', 'manager'],
    'security': ['security', 'manager'],
    'archive': ['manager']
};

const ROLE_RESTRICTIONS = {
    'Nettoyage': ['archive']
};

const ZONE_CAPACITIES = {
    'conference': 8,
    'reception': 2,
    'server': 3,
    'security': 4,
    'staff': 6,
    'archive': 2
};
var idMd;
// les arrayers
var workers = {};
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
  const photo = document.getElementById("employeePhoto");
  const phone = document.getElementById("employeePhone");
  name.style.border = "";
  role.style.border = "";
  email.style.border = "";
  photo.style.border = "";
  phone.style.border = "";
  removeErrorMessages();
  const validations = {
    name: /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/.test(name.value.trim()),
    role: /^(other|Nettoyage|security|technician|Receptionniste|manager)$/.test(
      role.value
    ),
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value),
    photo:
      /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|.*\.(jpg|jpeg|png|gif|webp))$/i.test(
        photo.value
      ),
    phone: /^(?:(?:\+|00)33|0)[1-9](?:[\s.-]*\d{2}){4}$/.test(phone.value),
  };

  const errorMessages = {
    name: "Le nom doit contenir 2 à 50 caractères alphabétiques",
    role: "Veuillez sélectionner un rôle valide",
    email: "Format d'email invalide (ex: exemple@domaine.com)",
    photo: "URL ou nom de fichier image invalide (jpg, jpeg, png, gif, webp)",
    phone:
      "Format de téléphone français invalide (ex: 0123456789 ou +33123456789)",
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
    if (!validations.photo) {
      showError(photo, errorMessages.photo);
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
    if (workerRole === 'manager') return true;
    if (ROLE_RESTRICTIONS[workerRole]?.includes(targetZone)) {
        return false;
    }
    const allowedRoles = ACCESS_RULES[targetZone];
    if (allowedRoles){
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
        if (employees.find(emp => emp.id == employeeId)) {
            return getZoneDisplayName(zoneName);
        }
    }
    return 'Non assigné';
}
function getZoneDisplayName(zoneId) {
    const zoneNames = {
        'conference': 'Salle de Conférence',
        'reception': 'Réception', 
        'server': 'Salle des Serveurs',
        'security': 'Salle de Sécurité',
        'staff': 'Salle du Personnel',
        'archive': 'Salle d\'Archives'
    };
    return zoneNames[zoneId] || zoneId;
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
  if (event) event.preventDefault();
  if (errorValidat()) {
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
  } else {
    return false;
  }
}
function displayPhoto(e) {
  let urlPhoto = e.target.value;
  let photoPreview = document.getElementById("photoPreview");
  if (
    /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp)|.*\.(jpg|jpeg|png|gif|webp))$/i.test(
      urlPhoto
    )
  ) {
    photoPreview.innerHTML = `<img src="${urlPhoto}" alt="profil" onerror="this.style.display='none'">`;
  } else {
    photoPreview.innerHTML = `<p style="color: #666;">Aperçu de la photo</p>`;
  }
}
function displayWorker() {
  let unassignedStaffList = document.getElementById("unassignedStaffList");
    const workers = getData();
    const zones = getDataZone();
    const assignedIds = new Set();
    Object.values(zones).forEach(zoneEmployees => {
        zoneEmployees.forEach(emp => assignedIds.add(emp.id));
    });
    
    const unassignedWorkers = workers.filter(worker => !assignedIds.has(worker.id));

    if (!unassignedWorkers || unassignedWorkers.length === 0) {
        unassignedStaffList.innerHTML = "<p class='empty-zone'>Aucun employé non assigné</p>";
        return;
    }

    unassignedStaffList.innerHTML = "";
    unassignedWorkers.forEach((worker) => {
        unassignedStaffList.appendChild(displaySpan(worker));
    });
    addEventListeners();
}
function displayCardsWorker(role) {
    zoneAssignmentModal.style.display = "block";
    eligibleEmployeesList.innerHTML = "";
    let workers = getData();
    let zones = getDataZone();
    const assignedIds = new Set();
    console.log(assignedIds);
    console.log(Object.values(zones));
    Object.values(zones).forEach(zoneEmployees => {
        zoneEmployees.forEach(emp => assignedIds.add(emp.id));
    });
    const eligibleWorkers = workers.filter(worker => 
        !assignedIds.has(worker.id) && canAssignToZone(worker.role, role)
    );
    if (eligibleWorkers.length === 0) {
        eligibleEmployeesList.innerHTML = "<p class='empty-zone'>Aucun employe eligible disponible</p>";
    } else {
        eligibleWorkers.forEach((worker) => {
            eligibleEmployeesList.appendChild(assignmentSpan(worker, role));
        });
    }
    addEventListeners();
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
function assignmentSpan(worker,role) {
  let divlist = document.createElement("div");
  divlist.className = "card-worker";
  divlist.innerHTML = `
  <div class="photo-preview"><img src="${worker.photo}" alt="${worker.name}"></div>
  <div class="name-preview"data-id='${worker.id}'><p>${worker.name}</p><p>${worker.role}</p></div>
  <div class="btn-card">
   <button  class="btn-add-experience" role="${role}"data-id='${worker.id}'><img width="24" height="24" src="https://img.icons8.com/softteal-gradient/24/add.png" alt="add"/></button>
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
   <button  class="btn-add-card"data-id='${worker.id}'>✕</button>
   </div>`;
  } else {
    divlist.innerHTML = `<div class="empty-zone">Aucun employe</div>`;
  }
  addEventListeners()
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
        alert(` Les ${employe.role} ne peuvent pas être affectés à la ${getZoneDisplayName(role)}`);
        return false;
    }
    if (isZoneFull(role)) {
        alert(` La ${getZoneDisplayName(role)} est pleine (max: ${ZONE_CAPACITIES[role]} employés)`);
        return false;
    }
  let zones = getDataZone();
    Object.keys(zones).forEach(zone => {
        zones[zone] = zones[zone].filter(emp => emp.id != workerId);
    });

    if (zones.hasOwnProperty(role)) {
        zones[role].push(employe);
        saveDataZone(zones);
        updateZoneDisplay(role);
        displayWorker(); // ==== AJOUT: Mettre à jour la liste non assignée
        console.log(`Employé ${workerId} ajouté à la zone ${role}`);
        return true;
    } else {
        console.error(`Zone ${role} non reconnue`);
        return false;
    }
}
function removeCardAssignment(workerId) {
    let zones = getDataZone();
    let employeeRemoved = false;
    Object.keys(zones).forEach(zone => {
        const initialLength = zones[zone].length;
        zones[zone] = zones[zone].filter(emp => emp.id != workerId);
        if (zones[zone].length !== initialLength) {
            employeeRemoved = true;
            updateZoneDisplay(zone);
        }
    });

    if (employeeRemoved) {
        saveDataZone(zones);
        displayWorker(); 
    }
}
function updateZoneDisplay(zoneId) {
  let zones = getDataZone();
  let zoneElement = document.getElementById(`${zoneId}-staff`);
  if (zoneElement) {
    zoneElement.innerHTML = '';
    zones[zoneId].forEach(worker => {
      const card = assignmentZone(worker);
      zoneElement.appendChild(card);
    });
     let zoneCounter = document.querySelector(`[data-zone="${zoneId}"] .zone-counter`);
        if (zoneCounter) {
            zoneCounter.textContent = `${zones[zoneId].length}/${ZONE_CAPACITIES[zoneId]}`;
        }
    if (zones[zoneId].length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-zone';
      emptyMessage.textContent = 'Aucun employé affecté';
      zoneElement.appendChild(emptyMessage);
    }
   
  }

}
function updateAllZonesDisplay() {
    const zones = ['conference', 'reception', 'server', 'security', 'staff', 'archive'];
    zones.forEach(zone => updateZoneDisplay(zone));
}
function addEventListeners() {
  document.querySelectorAll(".btn-add").forEach((button) => {
    button.addEventListener("click", function () {
      let btnAtrube = this.getAttribute("data-zone");
      displayCardsWorker(btnAtrube);
    });
  });
  document.querySelectorAll(".zone-content").forEach((button) => {
    button.addEventListener("click", function () {
    updateAllZonesDisplay();
    });
  });
  document.querySelectorAll(".name-preview").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      displayProfil(workerId);
    });
  });
  document.querySelectorAll(".name-zone").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
       const roleWorker = this.getAttribute("role");
       console.log(roleWorker)
      displayProfil(workerId,roleWorker);
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
  document.querySelectorAll(".btn-add-experience").forEach((button) => {
    button.addEventListener("click", function () {
      const workerId = this.getAttribute("data-id");
      const roleWorker = this.getAttribute("role");
      addCardAssignment(workerId,roleWorker);
    });
  });

  document.querySelectorAll(".btn-add-card").forEach((button) => {
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            const workerId = this.getAttribute("data-id");
            removeCardAssignment(workerId);
        });
    });

    document.querySelectorAll(".btn-add").forEach((button) => {
        button.addEventListener("click", function () {
            let zone = this.getAttribute("data-zone");
            if (!isZoneFull(zone)) {
                displayCardsWorker(zone);
            } else {
                alert(`Cette zone est pleine (${ZONE_CAPACITIES[zone]} employés maximum)`);
            }
        });
    });
}
function removeCard(id){
 let employes = getData();
    let newEpmloyes = employes.filter((emp) => emp.id != id);
    console.log(newEpmloyes);
    localStorage.setItem(workerKy, JSON.stringify(newEpmloyes));
    removeCardAssignment(id); 
    displayWorker();
} 
function deleteWorker(id) {
  let conf = confirm("se vuex supprimer ce employe");
  if (conf) {
    removeCard(id)
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
function displayProfil(id,role=null) {
  openProfileModal();
    let employes = getData();
    let newEpmloye = employes.find((emp) => emp.id == id);
    
    if (!newEpmloye) {
        let data = getDataZone();
        // Chercher dans toutes les zones
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
        // ==== AJOUT: Localisation actuelle ====
        document.getElementById("profileLocation").textContent = findEmployeeLocation(id);
        
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
}
document.addEventListener("DOMContentLoaded", () => {
  displayWorker();
  appInit();
  initializeDataZone();
   updateAllZonesDisplay();
});
