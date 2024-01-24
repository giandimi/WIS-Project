const api = "http://127.0.0.1:5000";

window.onload = () => {
    // BEGIN CODE HERE
    const searchButton = document.getElementById("getSearch");
    searchButton.onclick = searchButtonOnClick;
    const saveButton = document.getElementById("postReq");
    saveButton.onclick = productFormOnSubmit;
//    const searchInput = document.getElementById("inputProduct");

    // END CODE HERE
 }

searchButtonOnClick = () => {
    // BEGIN CODE HERE
    const getProduct = document.getElementById("inputProduct");
    const res = new XMLHttpRequest();
    res.open("GET", `${api}/search?name=${getProduct.value}`);
    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                console.log(res.responseText);

                const resultsTable = document.getElementById("resultsTable");
                // Clear the existing table body
                resultsTable.innerHTML = "";

                const resText = JSON.parse(res.responseText);

                // Create a table row for the titles
                const titleRow = document.createElement("tr");
                const titleId = document.createElement("th");
                const titleName = document.createElement("th");
                const titleYear = document.createElement("th");
                const titlePrice = document.createElement("th");
                const titleColor = document.createElement("th");
                const titleSize = document.createElement("th");

                titleId.innerHTML = "ID";
                titleName.innerHTML = "Name";
                titleYear.innerHTML = "Production Year";
                titlePrice.innerHTML = "Price";
                titleColor.innerHTML = "Color";
                titleSize.innerHTML = "Size";

                titleRow.appendChild(titleId);
                titleRow.appendChild(titleName);
                titleRow.appendChild(titleYear);
                titleRow.appendChild(titlePrice);
                titleRow.appendChild(titleColor);
                titleRow.appendChild(titleSize);

                resultsTable.appendChild(titleRow);

                // Process each item in the response
                resText.forEach(item => {
                    // Create a new table row for each item
                    const row = document.createElement("tr");

                    // Create a table data element for each property
                    const tableId = document.createElement("td");
                    const tableName = document.createElement("td");
                    const tableYear = document.createElement("td");
                    const tablePrice = document.createElement("td");
                    const tableColor = document.createElement("td");
                    const tableSize = document.createElement("td");

                    // Set the inner HTML of each table data element to the corresponding property
                    tableId.innerHTML = `${item.id}`;
                    tableName.innerHTML = `${item.name}`;
                    tableYear.innerHTML = `${item.production_year}`;
                    tablePrice.innerHTML = `${item.price}`;
//                    tableColor.innerHTML = `${item.color}`;
                    // Translate the color code to color name
        switch (item.color) {
            case 1:
                tableColor.innerHTML = "Red";
                break;
            case 2:
                tableColor.innerHTML = "Yellow";
                break;
            case 3:
                tableColor.innerHTML = "Blue";
                break;
            default:
                tableColor.innerHTML = `${item.color}`;
                break;
        }
        switch (item.size) {
            case 1:
                tableSize.innerHTML = "small";
                break;
            case 2:
                tableSize.innerHTML = "medium";
                break;
            case 3:
                tableSize.innerHTML = "large";
                break;
            case 4:
//                tableSize.innerHTML = "extra large";
                  tableSize.innerHTML = "extra&nbsp;large";

                break;
            default:
               tableSize.innerHTML = `${item.size}`;
               break;
             }

//                    tableSize.innerHTML = `${item.size}`;

                    // Append each table data element to the row
                    row.appendChild(tableId);
                    row.appendChild(tableName);
                    row.appendChild(tableYear);
                    row.appendChild(tablePrice);
                    row.appendChild(tableColor);
                    row.appendChild(tableSize);

                    // Append the row to the table
                    resultsTable.appendChild(row);
                });
            }
        }
    };
    res.send();
    getProduct.value = "";


    // END CODE HERE
}

productFormOnSubmit = (event) => {
    // BEGIN CODE HERE
//      event.preventDefault();
//
//    // Get form values
//    const name = document.getElementById("name").value;
//    const production_year = document.getElementById("year").value;
//    const price = document.getElementById("price").value;
//    const color = document.getElementById("fcolor").value;
//    const size = document.getElementById("size").value;
//
//    const res = new XMLHttpRequest();
//    res.open("POST", `http://127.0.0.1:5000/add-product`);
//    res.onreadystatechange = () => {
//        if (res.readyState == 4) {
//            if (res.status == 200) {
//                alert(res.responseText);
//
//                // Clear form fields
//                document.getElementById("name").value = "";
//                document.getElementById("year").value = "";
//                document.getElementById("price").value = "";
//                document.getElementById("fcolor").value = "";
//                document.getElementById("size").value = "";
//            }
//        }
//    };
//
//    res.setRequestHeader("Content-Type", "application/json");
//    res.send(JSON.stringify({
//        name: name,
//        production_year: production_year,
//        price: price,
//        color: color,
//        size: size
//    }));
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const production_year = document.getElementById("year").value;
    const price = document.getElementById("price").value;
    const color = document.getElementById("fcolor").value;
    const size = document.getElementById("size").value;

    const res = new XMLHttpRequest();
    res.open("POST", `http://127.0.0.1:5000/add-product`);
    res.onreadystatechange = () => {
        if (res.readyState == 4) {
            if (res.status == 200) {
                alert("ΟΚ"); // Add the alert here
//                alert(res.responseText);

                // Clear form fields
                document.getElementById("name").value = "";
                document.getElementById("year").value = "";
                document.getElementById("price").value = "";
                document.getElementById("fcolor").value = "";
                document.getElementById("size").value = "";
            }
        }
    };

    res.setRequestHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
        name: name,
        production_year: production_year,
        price: price,
        color: color,
        size: size
    }));


    // END CODE HERE
}
