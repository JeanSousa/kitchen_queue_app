function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}



const home = () => {
    document.getElementById('home-container').classList.remove('d-none');
    document.getElementById('product-container').classList.add('d-none')
}

/*
    --------------------------------------------------------------------------------------
    Prefix url to send request to backend
    --------------------------------------------------------------------------------------
*/
const prefixUrl = "http://127.0.0.1:5000/api";


/*
    --------------------------------------------------------------------------------------
    Function to create a product from the server via POST request
    --------------------------------------------------------------------------------------
*/
const createProduct = async () => {
    let url = `${prefixUrl}/products`;
    let name = document.getElementById('product-name').value
    let value = document.getElementById('product-value').value

    if(!name || !value) {
        alert('Preencha todos os campos!');
        return
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('value', value);

    try {
        let response = await fetch(url, 
            {
                method: 'post',
                body: formData,
            }
        )

        const data = await response.json()
        
        if (data.message) {
            alert(data.message)
            return
        }
        
        alert("Produto inserido com sucesso!")
        let {id, name, value} = data
    
        document.getElementById('product-name').value = ""
        document.getElementById('product-value').value = ""
    
        insrtProductItem(id, name, value)
    } catch (error) {
        insrtProductItem('', name, value)
        document.getElementById('product-name').value = ""
        document.getElementById('product-value').value = ""
        console.log(error)
    }

}

/*
    --------------------------------------------------------------------------------------
    Function to get the list of products from the server via GET request
    --------------------------------------------------------------------------------------
*/
const listProducts = async () => {
    let url = `${prefixUrl}/products`;

    document.getElementById('home-container').classList.add('d-none');
    document.getElementById('product-container').classList.remove('d-none')

    try {
        let response = await fetch(url, {method: 'get'})
        let { products } = await response.json()

        const tableBody = document.getElementById('my-table')
            .getElementsByTagName('tbody')[0];

        tableBody.innerHTML = "";

        if(!products) {
            alert('Não existem produtos na base de dados');
        }

        products.forEach(item => {insrtProductItem(item.id, item.name, item.value)})

    } catch (error) {
        console.log(error)
    }
}

/*
    --------------------------------------------------------------------------------------
    Function to delete product from the server via DELETE request
    --------------------------------------------------------------------------------------
*/
const deleteProduct = async (id) => {
    let url = `${prefixUrl}/products/${id}`;

    try {
        let response = await fetch(url, {method: 'delete'})

        let data = await response.json()

        if (data.message) {
            alert(`Produto ${data.name} deletado com sucesso!`);
        }

        document.getElementById(`product-${id}`).remove()    
    } catch (error) {
        console.log(error)
    }
}

/*
    --------------------------------------------------------------------------------------
    Function to edit product 
    --------------------------------------------------------------------------------------
*/
const editProduct = (id) => {
    console.log(`Edit product ${id}`);
}







const insrtProductItem = (id, name, value) => {
    const table = document.getElementById('my-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();
    row.setAttribute("id", `product-${id}`); // ID único para a linha

    // Insert name and value in table
    [name, value].forEach(content => {
        const cell = row.insertCell();
        cell.textContent = content;
    });

    // Insert action buttons
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
