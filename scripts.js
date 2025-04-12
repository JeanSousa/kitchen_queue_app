function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

const prefixUrl = "http://127.0.0.1:5000/api";

/*
    --------------------------------------------------------------------------------------
    Function to get the list of products from the server via GET request
    --------------------------------------------------------------------------------------
*/
const listProducts = async () => {
    let url = `${prefixUrl}/products`;

    document.getElementById('home-container').remove();
    document.getElementById('product-container').classList.remove('d-none')

    try {
        let response = await fetch(url, {method: 'get'})

        let { products } = await response.json()

        products.forEach(item => {insrtProductItem(item.id, item.name, item.value)})
    
    } catch (error) {
        console.log(error)
    }
}

function deleteProduct(button) {
    console.log(button);
    const row = button.closest("tr");
    row.remove();
}






const insrtProductItem = (id, name, value) => {
    const table = document.getElementById('my-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();

    // Insert name and value in table
    [name, value].forEach(content => {
        const cell = row.insertCell();
        cell.textContent = content;
    });

    // Insert cell and button
    const actionCell = row.insertCell();
    actionCell.innerHTML = `
        <button class="btn btn-sm btn-primary me-2" onclick="editProduct(${id})">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${id})">
            <i class="bi bi-trash"></i>
        </button>
    `;
};
