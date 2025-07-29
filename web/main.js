async function extractTextFromPDF(file) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      let fullText = '';
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const text = await page.getTextContent();
        fullText += text.items.map(item => item.str).join(' ') + '\n';
      }
      resolve(fullText);
    };
    reader.readAsArrayBuffer(file);
  });
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfUpload");
  const file = fileInput.files[0];
  if (!file) return alert("Please upload a PDF file.");

  document.getElementById("loading").style.display = "block";

  const pdfText = await extractTextFromPDF(file);
  const response = await fetch("https://your-backend-url.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: pdfText })
  });

  const result = await response.json();
  document.getElementById("loading").style.display = "none";

  if (result.flashcards) {
    document.getElementById("flashcardsText").value = result.flashcards;
    document.getElementById("flashcardsContainer").style.display = "block";
  } else {
    alert("Error generating flashcards.");
  }
});

function copyToClipboard() {
  const textArea = document.getElementById("flashcardsText");
  textArea.select();
  document.execCommand("copy");
}

function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = document.getElementById("flashcardsText").value;
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save("flashcards.pdf");
}

