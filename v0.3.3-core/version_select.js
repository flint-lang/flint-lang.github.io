document.addEventListener("DOMContentLoaded", function () {
  // Method 1: Standard way to get element by ID (should be unique)
  const sidebarElement = document.getElementById("sidebar");
  if (sidebarElement) {
    console.log("Found sidebar element:", sidebarElement);

    // Get the first child of the sidebar
    const firstChild = sidebarElement.firstElementChild;
    if (firstChild) {
      // Fetch the version selector HTML
      fetch("/version_select.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((html) => {
          // Create a container div for the version selector
          const versionContainer = document.createElement("div");
          versionContainer.id = "version-selector";
          versionContainer.innerHTML = html;

          // Create horizontal sseparator
          const separator = document.createElement("hr");
          separator.id = "version_separator";

          // Insert it at the beginning of the first child
          firstChild.insertBefore(versionContainer, firstChild.firstChild);
          // Insert the separator right after the version container
          firstChild.insertBefore(separator, versionContainer.nextSibling);

          // Add event listener for the version selection
          const versionSelect = document.getElementById("version");
          if (versionSelect) {
            // Set the correct selected value based on the current URL
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split("/").filter((segment) => segment != "");

            if (pathSegments.length > 0) {
              // The first segment should be the version
              const currentVersion = pathSegments[0];
              console.log("Current version detected: ", currentVersion);
              versionSelect.value = currentVersion;
            }

            // Add event listener for version selection
            versionSelect.addEventListener("change", function () {
              const selectedVersion = this.value;
              // Nativate to the selected version directory
              window.location.href = `/${selectedVersion}/`;
            });
          }
        })
        .catch((error) => {
          console.error("Error loading version selector:", error);
        });
    }
  } else {
    console.log('No element found with id "sidebar"');
  }
});
