// Scripts extracted from PreguntasFrecuentes.html
(function () {
  const searchInput = document.getElementById("faq-search");
  const faqList = document.getElementById("faq-list");

  function filterFAQs(term) {
    const q = term.trim().toLowerCase();
    const details = faqList.querySelectorAll("details");
    details.forEach((d) => {
      const text = (
        d.querySelector("summary").innerText +
        " " +
        (d.querySelector("p")?.innerText || "")
      ).toLowerCase();
      if (!q || text.includes(q)) {
        d.style.display = "";
      } else {
        d.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", (e) => filterFAQs(e.target.value));
  document.getElementById("clear-search").addEventListener("click", () => {
    searchInput.value = "";
    filterFAQs("");
    searchInput.focus();
  });
})();

function toggleTutorial(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "none" || el.style.display === "" ? "block" : "none";
}

function downloadGuide() { alert("Descarga simulada: aquí podrías enlazar el PDF real."); }
