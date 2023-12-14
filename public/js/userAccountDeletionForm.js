const userLoginForm = document.getElementById("user-account-deletion-form");
userLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("password").value;
  const response = await fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  await response.json().then(async (jsonResponse) => {
    if (jsonResponse.success) {
      // start the deletion process
      const response = await fetch("/user/accountDeletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jsonResponse.token}`,
        },
        body: JSON.stringify({ email }),
      });
      await response.json().then((jsonResponse) => {
        if (jsonResponse.success) {
          window.location.pathname =
            "templates/html/userAccountDeleteSuccess.html";
        }
      });
    } else {
      alert(jsonResponse.message);
    }
  });
});
