
// ===== Resume Builder Logic =====
const form = document.getElementById("resumeForm");
const downloadBtn = document.getElementById("downloadBtn");
const addSectionBtn = document.getElementById("addSectionBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

const fields = ["name","email","phone","linkedin","education","experience","skills","achievements"];
const previewFields = {
  name: "previewName",
  email: "previewContact",
  phone: "previewContact",
  linkedin: "previewContact",
  education: "previewEducation",
  experience: "previewExperience",
  skills: "previewSkills",
  achievements: "previewAchievements"
};

// Live Preview
fields.forEach(f => {
  document.getElementById(f).addEventListener("input", () => {
    if(f==="email"||f==="phone"||f==="linkedin"){
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const linkedin = document.getElementById("linkedin").value;
      let contact = `${email || "Email"} | ${phone || "Phone"}`;
      if(linkedin) contact += ` | ${linkedin}`;
      document.getElementById("previewContact").textContent = contact;
    } else {
      document.getElementById(previewFields[f]).textContent = document.getElementById(f).value || f.charAt(0).toUpperCase() + f.slice(1);
    }
  });
});

// Template switch
document.getElementById("template").addEventListener("change", e=>{
  const preview = document.getElementById("preview");
  preview.className = "resume " + e.target.value;
});

// Font change
document.getElementById("fontSelect").addEventListener("change", e=>{
  document.getElementById("preview").style.fontFamily = e.target.value;
});

// Heading color
document.getElementById("headingColor").addEventListener("input", e=>{
  const headings = document.querySelectorAll("#preview h1, #preview h3");
  headings.forEach(h => h.style.color = e.target.value);
});

// Drag & Drop
Sortable.create(document.getElementById("sections"), {
  animation: 150,
  handle: ".section"
});

// Add Section dynamically
addSectionBtn.addEventListener("click", ()=>{
  const sectionName = prompt("Enter section name (e.g., Projects, Certifications, Hobbies)");
  if(sectionName){
    const container = document.getElementById("sections");
    const div = document.createElement("div");
    div.className="section";
    div.dataset.type=sectionName.toLowerCase();
    div.innerHTML=`<h3>${sectionName}</h3><p contenteditable="true">Enter details here</p>`;
    container.appendChild(div);
  }
});

// Save/Load JSON
saveBtn.addEventListener("click", ()=>{
  const data = {fields:{}, sections:[]};
  fields.forEach(f=>{
    data.fields[f] = document.getElementById(f).value;
  });
  document.querySelectorAll("#sections .section").forEach(sec=>{
    data.sections.push({
      type: sec.dataset.type,
      content: sec.querySelector("p").innerText
    });
  });
  const blob = new Blob([JSON.stringify(data)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="resume.json";
  a.click();
});

// Load JSON
loadBtn.addEventListener("click", ()=>{
  const input = document.createElement("input");
  input.type="file";
  input.accept=".json";
  input.onchange = e=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ev=>{
      const data = JSON.parse(ev.target.result);
      fields.forEach(f=>{
        document.getElementById(f).value = data.fields[f]||"";
        document.getElementById(f).dispatchEvent(new Event('input'));
      });
      const container=document.getElementById("sections");
      container.innerHTML="";
      data.sections.forEach(sec=>{
        const div = document.createElement("div");
        div.className="section";
        div.dataset.type=sec.type;
        div.innerHTML=`<h3>${sec.type.charAt(0).toUpperCase()+sec.type.slice(1)}</h3><p contenteditable="true">${sec.content}</p>`;
        container.appendChild(div);
      });
    };
    reader.readAsText(file);
  };
  input.click();
});

// PDF Download
downloadBtn.addEventListener("click", ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y=20;
  doc.setFontSize(18);
  doc.text(document.getElementById("name").value || "Your Name",10,y);
  y+=10;
  doc.setFontSize(12);
  doc.text(document.getElementById("previewContact").textContent,10,y);
  y+=10;
  document.querySelectorAll("#sections .section").forEach(sec=>{
    const title = sec.querySelector("h3").innerText;
    const content = sec.querySelector("p").innerText;
    if(content){
      y+=5;
      doc.setFontSize(14);
      doc.text(title,10,y);
      y+=7;
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(content,180);
      lines.forEach(line=>{
        if(y>280){
          doc.addPage();
          y=20;
        }
        doc.text(line,10,y);
        y+=7;
      });
    }
  });
  doc.save("resume.pdf");
});

// ===== AI Subtitle Generator Placeholder =====
document.getElementById('generateSubBtn').addEventListener('click', function() {
  const video = document.getElementById('videoInput').files[0];
  if(!video) {
    alert("Please upload a video first!");
    return;
  }
  document.getElementById('subtitleOutput').value =
    "This is a sample subtitle.\nGenerated subtitles will appear here after AI processing.";
});

// ===== Tab Navigation =====
function showSection(id){
  document.getElementById('resume-builder').style.display='none';
  document.getElementById('subtitles').style.display='none';
  document.getElementById(id).style.display='block';
}
// default
showSection('resume-builder');
