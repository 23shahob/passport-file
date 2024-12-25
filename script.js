document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const passportUpload = document.getElementById("passport-upload");
  const idCardUpload = document.getElementById("id-card-upload");
  const passportPreview = document.getElementById("passport-preview");
  const idCardPreview = document.getElementById("id-card-preview");
  const messageDiv = document.getElementById("message");

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`${btn.dataset.tab}-tab`).classList.add("active");
    });
  });

  // Image preview
  function previewImage(input, previewDiv) {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        previewDiv.innerHTML = "";
        previewDiv.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }

  passportUpload.addEventListener("change", () =>
    previewImage(passportUpload, passportPreview)
  );
  idCardUpload.addEventListener("change", () =>
    previewImage(idCardUpload, idCardPreview)
  );

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const activeTab = document.querySelector(".tab-content.active");
    const fileInput = activeTab.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      messageDiv.textContent = "Please select a file to upload.";
      messageDiv.style.color = "orange";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append(
      "type",
      activeTab.id === "passport-tab" ? "passport" : "id-card"
    );

    try {
      messageDiv.textContent = "Uploading...";
      const response = await fetch("https://api.example.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        messageDiv.textContent = "Document uploaded successfully!";
        fileInput.value = "";
        activeTab.querySelector(".preview").innerHTML = "";
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      messageDiv.textContent = "Error uploading document. Please try again.";
      messageDiv.style.color = "red";
      console.error("Error:", error);
    }
  });
});
