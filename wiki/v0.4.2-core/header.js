document.addEventListener("DOMContentLoaded", function () {
    var btns = document.querySelector(".right-buttons");
    if (!btns) return;
    var home = document.createElement("a");
    home.href = "/";
    home.title = "Back to homepage";
    home.setAttribute("aria-label", "Back to homepage");
    home.innerHTML = '<i class="fa fa-home"></i>';
    btns.appendChild(home);
});
