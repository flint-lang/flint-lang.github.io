document.addEventListener("DOMContentLoaded", function () {
    const toc = document.querySelector(".nav-chapters");

    if (toc) {
        // Add toggle buttons to chapters
        toc.querySelectorAll("li.chapter").forEach((chapter) => {
            const hasChildren = chapter.querySelector("ul");
            if (hasChildren) {
                const toggle = document.createElement("span");
                toggle.className = "chapter-toggle";
                toggle.innerHTML = "▶"; // Arrow symbol
                toggle.style.cursor = "pointer";
                toggle.style.marginRight = "10px";

                chapter.prepend(toggle);
                chapter.classList.add("collapsible");

                // Event listener for toggling visibility
                toggle.addEventListener("click", () => {
                    const childList = chapter.querySelector("ul");
                    if (childList.style.display === "none") {
                        childList.style.display = "block";
                        toggle.innerHTML = "▼"; // Down arrow
                    } else {
                        childList.style.display = "none";
                        toggle.innerHTML = "▶"; // Right arrow
                    }
                });

                // Initially collapse all sub-chapters
                const childList = chapter.querySelector("ul");
                if (childList) {
                    childList.style.display = "none";
                }
            }
        });
    }
});

