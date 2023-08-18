const email = document.getElementById("emailId").value;
const token = document.getElementById("tokenId").value;
const passwordResetForm = document.getElementById("password-reset-form");
passwordResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  const response = await fetch("/user/resetPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, token, newPassword }),
  });
  await response.json().then((jsonResponse) => {
    if (jsonResponse.success) {
      window.location.pathname = "templates/html/passwordResetSuccess.html";
    } else {
      alert(jsonResponse.message);
    }
  });
});
