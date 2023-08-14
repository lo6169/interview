function loadAndParseCSV() {
    const filePath = './Model/Documents.csv';

    return fetch(filePath)
        .then(response => response.text())
        .then(contents => {
            const lines = contents.split('\n');
            const parsedData = [];

            for (let i = 1; i < lines.length; i++) {
                const cells = lines[i].split(',');

                if (cells.length === 3) {
                    const name = cells[0].trim();
                    const path = cells[1].trim();
                    const category = cells[2].trim();

                    parsedData.push({ name, path, category });
                }
            }

            return parsedData;
        })
        .catch(error => {
            console.error('Error loading or parsing CSV file:', error);
            return []; 
        });
}

document.addEventListener("DOMContentLoaded", async function () {
    const fileTable = document.getElementById("fileTable").getElementsByTagName("tbody")[0];
    const newDocumentInput = document.getElementById("newDocumentInput");
    const uploadButton = document.getElementById("uploadButton");

    uploadButton.addEventListener("click", handleDocumentUpload);

    const csvData = await loadAndParseCSV();

    for (const item of csvData) {
        const newRow = fileTable.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.textContent = item.name;

        const pathCell = newRow.insertCell(1);
        pathCell.textContent = item.path;

        const categoryCell = newRow.insertCell(2);
        categoryCell.textContent = item.category;

        const actionsCell = newRow.insertCell(3);
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.addEventListener("click", () => {
            viewFile(item.path);
        });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteFile(item)
            console.log(`Deleting ${item.name}`);
        });

        actionsCell.appendChild(viewButton);
        actionsCell.appendChild(deleteButton);
    }

    async function deleteFile(item) {
        const confirmed = confirm(`Are you sure you want to delete ${item.name}?`);
        if (!confirmed) {
            return;
        }
    
        // Here's where I would actually delete the 
        const deleteIndex = csvData.findIndex(dataItem => dataItem.name === item.name);
        if (deleteIndex !== -1) {
            csvData.splice(deleteIndex, 1);
            await updateCSVFile();
            refreshTable();
        }
    }
    
    async function updateCSVFile() {
        const csvContent = csvData.map(item => `${item.name},${item.path},${item.category}`).join('\n');
        const filePath = './Model/Documents.csv'; 
    
        try {
            const response = await fetch(filePath, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: csvContent
            });
    
            if (!response.ok) {
                console.error('Error updating CSV file:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating CSV file:', error);
        }
    }

    function viewFile(path) {
        path = convertBackslashesToForwardSlashes(path);
        if (!path.startsWith("/")) {
            path = "./Model/" + path;
        } else {
            path = "./Model" + path
        }
        path = removeSpaces(path);

        const newWindow = window.open();
        newWindow.document.write(`<iframe src="${path}" width="100%" height="600"></iframe>`);
    }

    function convertBackslashesToForwardSlashes(path) {
        return path.replace(/\\/g, "/");
    }

    function removeSpaces(path) {
        return path.replace(/ /g, "");
    }

    async function handleDocumentUpload() {
        const newDocumentFile = newDocumentInput.files[0];
        if (newDocumentFile) {
            // Here's where I would handle actually uploading the document
            const newDocumentDetails = {
                name: newDocumentFile.name,
                path: `/Docs/NewFolder/${newDocumentFile.name}`,
                category: "New Category"
            };

            csvData.push(newDocumentDetails);
            refreshTable();
        }
    }

    function refreshTable() {
        while (fileTable.firstChild) {
            fileTable.removeChild(fileTable.firstChild);
        }
        for (const item of csvData) {
            const newRow = fileTable.insertRow();
    
            const nameCell = newRow.insertCell(0);
            nameCell.textContent = item.name;
    
            const pathCell = newRow.insertCell(1);
            pathCell.textContent = item.path;
    
            const categoryCell = newRow.insertCell(2);
            categoryCell.textContent = item.category;
    
            const actionsCell = newRow.insertCell(3);
            const viewButton = document.createElement("button");
            viewButton.textContent = "View";
            viewButton.addEventListener("click", () => {
                viewFile(item.path);
            });
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                deleteFile(item)
                console.log(`Deleting ${item.name}`);
            });
    
            actionsCell.appendChild(viewButton);
            actionsCell.appendChild(deleteButton);
        }
    }
});
