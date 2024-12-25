document.addEventListener("DOMContentLoaded", () => {
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

  idCardUpload.addEventListener("change", () =>
    previewImage(idCardUpload, idCardPreview)
  );
  passportUpload.addEventListener("change", () =>
    previewImage(passportUpload, passportPreview)
  );

  // Form submission for ID Card
  const formIdCard = document.getElementById("upload-form-id-card");
  formIdCard.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = idCardUpload.files[0];
    if (!file) {
      messageDiv.textContent = "Please select an ID card to upload.";
      messageDiv.style.color = "orange";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      messageDiv.textContent = "Uploading...";
      messageDiv.style.color = "orange";
      const response = await fetch("http://10.4.0.63:8000/api/v1/id_card", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        messageDiv.textContent = "ID Card uploaded successfully!";
        messageDiv.style.color = "green";
        idCardUpload.value = "";
        idCardPreview.innerHTML = "";
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      messageDiv.textContent = "Error uploading ID Card. Please try again.";
      messageDiv.style.color = "red";
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        messageDiv.textContent = "";
      }, 5000);
    }
  });

  // Form submission for Passport
  const formPassport = document.getElementById("upload-form-passport");
  formPassport.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = passportUpload.files[0];
    if (!file) {
      messageDiv.textContent = "Please select a passport to upload.";
      messageDiv.style.color = "orange";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      messageDiv.textContent = "Uploading...";
      messageDiv.style.color = "orange";
      const response = await fetch("http://10.4.0.63:8000/api/v1/passport", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        messageDiv.textContent = "Passport uploaded successfully!";
        messageDiv.style.color = "green";
        passportUpload.value = "";
        passportPreview.innerHTML = "";
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      messageDiv.textContent = "Error uploading Passport. Please try again.";
      messageDiv.style.color = "red";
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        messageDiv.textContent = "";
      }, 5000);
    }
  });
});
