// les varaibles sidbar;
let addWorkerBtn = document.getElementById("addWorkerBtn");
let unassignedStaffList = document.getElementById("unassignedStaffList");
let addExperienceBtn = document.getElementById("addExperienceBtn");
// les varaibles main
let btnAddZone = document.getElementsByClassName("btn-add");
let btnZoneContent = document.getElementsByClassName("btn-add");
// les arrayers
var workers = [];
var experiences = [];

// les cours des fonctions
function openModalWorker() {
  let addEmployeeModal = (document.getElementById(
    "addEmployeeModal"
  ).style.display = "block");
}

function closeModalzorker() {
  cancelBtn.addEventListener("click", () => {
    let addEmployeeModal = (document.getElementById(
      "addEmployeeModal"
    ).style.display = "none");
  });
}
function ModalAddExperience() {
  let experiencesContainer = document.getElementById("experiencesContainer");
  let experience = experiencesContainer.querySelector("input");
  if (!experience.value || !experience.value.trim()) return;
  if (experiences.includes(experience.value.trim().toLowerCase())) return;
  experiences.push(experience.value);
  console.log(experiences);
  let contentExperience=document.getElementById("content-experience")
  const span = document.createElement("span");
  span.className = "span-experience";
  span.innerHTML = `
        ${experience.value.trim()}
        <button 
            type="button" 
            class="remove-experience-btn"
            aria-label="Remove ${experience.value.trim()}"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>`;
        console.log(span.textContent);
  span.querySelector(".remove-experience-btn").addEventListener("click", () => {
    setTimeout(() => span.remove(), 200);
    let filtreExperience=[];
    filtreExperience=experiences.filter(ex=>ex!==span.textContent.trim().toLowerCase())
    console.log(filtreExperience);
  });
  contentExperience.appendChild(span);
}

function ModalAddEmployer() {
  console.log(experiences);
  experiences = [];
}

function appInit() {
  let addEmployerBtn = document.getElementById("addEmployerBtn");
  addEmployerBtn.addEventListener("click", ModalAddEmployer);
  addWorkerBtn.addEventListener("click", openModalWorker);

  let cancelBtn = document.getElementById("cancelBtn");
  cancelBtn.addEventListener("click", closeModalzorker);

  let addExperienceBtn = document.getElementById("addExperienceBtn");
  addExperienceBtn.addEventListener("click", ModalAddExperience);
}
appInit();
