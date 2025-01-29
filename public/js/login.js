// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const googleSignInButton = document.getElementById("loginButton");
  // const userInfoDisplay = document.getElementById("user-info");

  // Add click listener to the login button
  googleSignInButton.addEventListener("click", () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // Retrieve user details
        const user = result.user;
        const name = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;

        fetch("/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, photoURL }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              // Store user ID in localStorage
              localStorage.setItem("userId", data.user._id);
              //console.log("User ID", localStorage.getItem("userId"))
              window.location.href = "/main.html"; // Redirect normal user
            }
          });
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
        //   userInfoDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      });
  });
});
