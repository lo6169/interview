
document.addEventListener("DOMContentLoaded", function () {
  // Function to load and parse the CSV file
  function loadAndParseCSV() {
      const filePath = '../Model/Documents.csv'; // Path to the CSV file relative to parseCSV.js

      return fetch(filePath)
          .then(response => response.text())
          .then(contents => {
              const lines = contents.split('\n');
              let parsedData = '';

              for (let i = 0; i < lines.length; i++) {
                  const cells = lines[i].split(',');

                  if (cells.length === 3) { // Make sure there are three columns: name, path, category
                      const name = cells[0].trim();
                      const path = cells[1].trim();
                      const category = cells[2].trim();

                      parsedData += `${name}, ${path}, ${category}\n`;
                  }
              }

              return parsedData;
          })
          .catch(error => {
              console.error('Error loading or parsing CSV file:', error);
              return ''; // Return empty data on error
          });
  }

  const fileTable = document.getElementById("fileTable").getElementsByTagName("tbody")[0];

  // Load and parse the CSV data and populate the table
  loadAndParseCSV().then(csvData => {
      const rows = csvData.split("\n");
      for (let i = 1; i < rows.length; i++) {
          const [name, path, category] = rows[i].split(",");
          const newRow = fileTable.insertRow();

          const nameCell = newRow.insertCell(0);
          nameCell.textContent = name;

          const pathCell = newRow.insertCell(1);
          pathCell.textContent = path;

          const categoryCell = newRow.insertCell(2);
          categoryCell.textContent = category;

          const actionsCell = newRow.insertCell(3);
          const viewButton = document.createElement("button");
          viewButton.textContent = "View";
          viewButton.addEventListener("click", () => {
              viewFile(path);
              console.log(`Viewing ${name}`);
          });
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
              // Handle edit action
              console.log(`Editing ${name}`);
          });
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => {
              // Handle delete action
              console.log(`Deleting ${name}`);
          });

          actionsCell.appendChild(viewButton);
          actionsCell.appendChild(editButton);
          actionsCell.appendChild(deleteButton);
      }
  });

  function viewFile(path) {
    path = convertBackslashesToForwardSlashes(path);
    // Ensure path starts with a slash
    if (!path.startsWith(".")) {
        path = "./" + path.trim();
    }
    console.log("PATH " + path)

    // Open a new window and load the PDF file in an iframe
    const newWindow = window.open();
    newWindow.document.write(`<iframe src="${path}" width="100%" height="600"></iframe>`);
  }

  function convertBackslashesToForwardSlashes(path) {
    return path.replace(/\\/g, "/");
  }
});

