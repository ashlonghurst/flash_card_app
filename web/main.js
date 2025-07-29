document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const pdfUpload = document.getElementById("pdfUpload");
  const loading = document.getElementById("loading");
  const flashcardsContainer = document.getElementById("flashcardsContainer");
  const flashcardsText = document.getElementById("flashcardsText");

  generateBtn.addEventListener("click", async () => {
    const file = pdfUpload.files[0];
    if (!file) {
      alert("❌ Please upload a PDF file.");
      return;
    }

    // Show spinner and hide output
    loading.style.display = "block";
    flashcardsContainer.style.display = "none";
    flashcardsText.value = "";

    try {
      const fullText = await extractTextFromPDF(file);
      const response = await fetch("https://flash-card-app-1gk4.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText.slice(0, 4000) }) // GPT-4o input limit
      });

      const result = await response.json();

      if (result.flashcards) {
        flashcardsText.value = result.flashcards;
        flashcardsContainer.style.display = "block";
      } else {
        flashcardsText.value = "❌ Failed to generate flashcards.";
        flashcardsContainer.style.display = "block";
      }
    } catch (err) {
      flashcardsText.value = "❌ Error: " + err.message;
      flashcardsContainer.style.display = "block";
    } finally {
      loading.style.display = "none";
    }
  });
});

async function extractTextFromPDF(file) {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

  let fullText = "";
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

function copyToClipboard() {
  const flashcardsText = document.getElementById("flashcardsText");
  flashcardsText.select();
  document.execCommand("copy");
  alert("📋 Flashcards copied to clipboard!");
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const flashcardsText = document.getElementById("flashcardsText").value;

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(flashcardsText, 180);
  doc.text(lines, 10, 10);
  doc.save("flashcards.pdf");
}



