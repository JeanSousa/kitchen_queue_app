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
        alert('Erro ao se comunicar com a base de dados!')
        insrtProductItem(null, name, value)
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
        alert('Erro ao se comunicar com a base de dados!')
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
        alert('Erro ao se comunicar com a base de dados!')
        document.getElementById(`product-${id}`).remove()
        console.log(error)
    }
}

/*
    --------------------------------------------------------------------------------------
    Function to edit product show product that should be updated 
    --------------------------------------------------------------------------------------
*/
const editProduct = async (id) => {
    let url = `${prefixUrl}/products/${id}`;

    try {
        let response = await fetch(url, {method: 'get'})
        let product = await response.json()

        if(!product) {
            alert('Produto não encontrado');
        }

        document.getElementById('edit-product-id').value = product.id
        document.getElementById('edit-product-name').value = product.name
        document.getElementById('edit-product-value').value = product.value

        const modal = new bootstrap.Modal(document.getElementById('product-modal'));
        modal.show();

    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        console.log(error)
    }
}

const updateProduct = async () => {
    let id = document.getElementById('edit-product-id').value
    let name = document.getElementById('edit-product-name').value
    let value = document.getElementById('edit-product-value').value

    const formData = new FormData();
    formData.append('name', name);
    formData.append('value', value);

    let url = `${prefixUrl}/products/${id}`;

    try {
        let response = await fetch(url, 
            {
                method: 'put',
                body: formData
            }
        )

        let data = await response.json()

        if (data.name) {
            alert(`Produto ${data.name} atualizado com sucesso!`);
            document.getElementById(`product-${id}`).remove()
            insrtProductItem(data.id, data.name, data.value)
        } 

        let productModal = document.getElementById('product-modal');
        let modal = bootstrap.Modal.getOrCreateInstance(productModal);
        modal.hide();
    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        document.getElementById(`product-${id}`).remove()
        console.log(error)
    }
}







const insrtProductItem = (id = 0, name, value) => {
    const table = document.getElementById('my-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();
    row.setAttribute("id", `product-${id}`);

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

