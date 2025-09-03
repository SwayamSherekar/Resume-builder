const form = document.getElementById("resumeForm");
const downloadBtn = document.getElementById("downloadBtn");

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
document.getElementById("template").addEventListener("change", (e) => {
  const preview = document.getElementById("preview");
  preview.className = "resume " + e.target.value;
});

// Font change
document.getElementById("fontSelect").addEventListener("change", (e)=>{
  document.getElementById("preview").style.fontFamily = e.target.value;
});

// Heading color
document.getElementById("headingColor").addEventListener("input", (e)=>{
  const headings = document.querySelectorAll("#preview h1, #preview h3");
  headings.forEach(h => h.style.color = e.target.value);
});

// PDF Download
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text(document.getElementById("name").value || "Your Name", 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(document.getElementById("previewContact").textContent, 10, y);
  y += 10;

  ["education","experience","skills","achievements"].forEach(field=>{
    const value = document.getElementById(field).value;
    if(value){
      y += 5;
      doc.setFontSize(14);
      doc.text(field.charAt(0).toUpperCase() + field.slice(1), 10, y);
      y += 7;
      doc.setFontSize(12);
      doc.text(value, 10, y);
      y += 15;
    }
  });

  doc.save(`${document.getElementById("name").value || "Resume"}.pdf`);
});

