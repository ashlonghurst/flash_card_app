document.getElementById("flashcardForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const pdfInput = document.getElementById("pdfUpload");
  const flashcardsDiv = document.getElementById("flashcards");
  const loading = document.getElementById("loading");

  flashcardsDiv.innerHTML = "";
  loading.style.display = "block";

  if (!pdfInput.files[0]) {
    flashcardsDiv.innerHTML = "❌ Please upload a PDF file.";
    loading.style.display = "none";
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
    try {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let fullText = "";
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(" ") + "\n";
      }

      // Send to backend
      const response = await fetch("https://flash-card-app-1gk4.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText })
      });

      const result = await response.json();

      if (result.flashcards) {
        flashcardsDiv.innerText = result.flashcards;
      } else {
        flashcardsDiv.innerText = "❌ Failed to generate flashcards.";
      }
    } catch (err) {
      flashcardsDiv.innerText = "❌ Error: " + err.message;
    } finally {
      loading.style.display = "none";
    }
  };

  reader.readAsArrayBuffer(pdfInput.files[0]);
});


