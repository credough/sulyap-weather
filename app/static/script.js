const form = document.getElementById("form");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = document.getElementById("location").value.trim();
  const activity = document.getElementById("activity").value;

  statusText.textContent = "Loading...";

  try {
    const res = await fetch("/api/recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, activity })
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    localStorage.setItem("results", JSON.stringify(data));
    window.location.href = "results.html";

  } catch {
    window.location.href = "error.html";
  }
});