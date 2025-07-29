async function uploadPDF() {
  const file = document.getElementById("pdfInput").files[0];
  if (!file) return alert("Please select a PDF");

  const text = await extractText(file);

  const res = await fetch("https://your-backend-url.onrender.com/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("output").textContent = data.flashcards || data.error;
}

async function extractText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib.getDocument(typedArray).promise.then(async (pdf) => {
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\n';
        }
        resolve(fullText);
      });
    };
    reader.readAsArrayBuffer(file);
  });
}
