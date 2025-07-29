document.getElementById("generateBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfUpload");
  const status = document.getElementById("status");
  const flashcardsBox = document.getElementById("flashcards");

  if (!fileInput.files[0]) {
    alert("Please select a PDF file first.");
    return;
  }

  status.textContent = "Uploading and generating flashcards...";
  flashcardsBox.value = "";

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("https://flash-card-app-1gk4.onrender.com/generate", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    flashcardsBox.value = data.flashcards;
    status.textContent = "✅ Flashcards generated successfully.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error generating flashcards.";
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const flashcards = document.getElementById("flashcards");
  flashcards.select();
  document.execCommand("copy");
  alert("Flashcards copied to clipboard!");
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const flashcards = document.getElementById("flashcards").value;
  const blob = new Blob([flashcards], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "flashcards.pdf";
  link.click();
});
