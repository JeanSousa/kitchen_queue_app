function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}


/*
    --------------------------------------------------------------------------------------
    Home view
    --------------------------------------------------------------------------------------
*/
const home = () => {
    document.getElementById('home-container').classList.remove('d-none');
    document.getElementById('product-container').classList.add('d-none');
    document.getElementById('order-container').classList.add('d-none')
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
    document.getElementById('order-container').classList.add('d-none');
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


/*
    --------------------------------------------------------------------------------------
    Function to update product  
    --------------------------------------------------------------------------------------
*/
const updateProduct = async () => {
    let id = document.getElementById('edit-product-id').value
    let name = document.getElementById('edit-product-name').value
    let value = document.getElementById('edit-product-value').value

    if(!name || !value) {
        alert('Preencha todos os campos!');
        return
    }

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


/*
    --------------------------------------------------------------------------------------
    Function insert products in table 
    --------------------------------------------------------------------------------------
*/
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



/*
    --------------------------------------------------------------------------------------
    Function to get the list of orders from the server via GET request
    --------------------------------------------------------------------------------------
*/
const listOrders = async () => {
    let url = `${prefixUrl}/orders`;

    document.getElementById('home-container').classList.add('d-none');
    document.getElementById('product-container').classList.add('d-none');
    document.getElementById('order-container').classList.remove('d-none')

    try {
        let response = await fetch(url, {method: 'get'})
        let { orders } = await response.json()

        const tableBody = document.getElementById('order-table')
            .getElementsByTagName('tbody')[0];

        tableBody.innerHTML = "";

        if(!orders) {
            alert('Não existem pedidos na base de dados');
        }

        let productUrl = `${prefixUrl}/products`

        let productsResponse = await fetch(productUrl, {method: 'get'})
        let { products } = await productsResponse.json()

        if(!products) {
            alert('Não existem produtos na base de dados');
        }

        products.forEach(item => {insrtProductItemInSelectField(item.id, item.name)})

        orders.forEach(item => {
            insertOrderItem(item.id, item.table_number, item.status, item.observation)
        })

    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        console.log(error)
    }
}


/*
    --------------------------------------------------------------------------------------
    Function inserts products in select field
    --------------------------------------------------------------------------------------
*/
const insrtProductItemInSelectField = (id, name) => {
    const select = document.getElementById('order-item');
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    select.appendChild(option);
}


/*
    --------------------------------------------------------------------------------------
    Function inserts inputs in a order
    --------------------------------------------------------------------------------------
*/
const addItemToOrder = () => {
    const select = document.getElementById('order-item');
    const quantityInput = document.getElementById('order-quantity');
    const container = document.getElementById('selected-items');

    const selectedOption = select.options[select.selectedIndex];
    const itemName = selectedOption.text;
    const itemId = selectedOption.value;
    const quantity = quantityInput.value;

    if (!itemId || quantity < 1) {
        alert('A quantidade do item deve ser maior ou igual a 1')
        return 
    } 

    // Create wrapper to item
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'input-group mb-2';

    // Field readonly
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control order-product-items';
    input.value = `${itemName} (Qtd: ${quantity})`;
    input.readOnly = true;
    input.setAttribute('data-id', itemId);
    input.setAttribute('data-quantity', quantity);

    // Remove button
    const btnWrapper = document.createElement('button');
    btnWrapper.className = 'btn btn-outline-danger';
    btnWrapper.type = 'button';
    btnWrapper.innerHTML = `<i class="bi bi-x-lg" id="remove-buton-${itemId}"></i>`;
    btnWrapper.onclick = () => container.removeChild(itemWrapper);

    itemWrapper.appendChild(input);
    itemWrapper.appendChild(btnWrapper);

    container.appendChild(itemWrapper);
}


/*
    --------------------------------------------------------------------------------------
    Function to insert orders and relationship order-products from the server via POST request
    --------------------------------------------------------------------------------------
*/
const createOrder = async () => {
    const orderUrl = `${prefixUrl}/orders`;
    const orderTableNumber = document.getElementById('order-table-number').value
    const orderStatus = document.getElementById('order-status').value
    const orderObservation = document.getElementById('order-observation').value
    const products = document.getElementsByClassName('order-product-items')

    if(!orderTableNumber || !orderStatus) {
        alert('Preencha todos os campos obrigatórios!');
        return
    }

    if (products.length == 0) {
        alert('Adicione produtos ao seu pedido no botão + ')
        return
    }

    const formData = new FormData();
    formData.append('table_number', orderTableNumber);
    formData.append('status', orderStatus);
    formData.append('observation', orderObservation);

    try {
        let response = await fetch(orderUrl, 
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
        
        const {id, table_number, status, observation} = data

        console.log('ID PEDIDO', id)
    
        document.getElementById('order-table-number').value = ""
        document.getElementById('order-observation').value = ""
    
        insertOrderItem(id, table_number, status, observation)

        for (let i = 0; i < products.length; i++) {
            let productId = products[i].dataset.id
            let productQuantity = products[i].dataset.quantity
            
            const orderProductsFormdata = new FormData();
            orderProductsFormdata.append('order_id', id);
            orderProductsFormdata.append('product_id', productId);
            orderProductsFormdata.append('amount', productQuantity);

            let productOrderUrl = `${prefixUrl}/order-products`

            let response = await fetch(productOrderUrl, 
                {
                    method: 'post',
                    body: orderProductsFormdata,
                }
            )
    
            const data = await response.json()

            if (data.message) {
                alert(data.message)
                return
            }
        }

        // clear product itens view
        const container = document.getElementById('selected-items');
        container.innerHTML = '';

        alert('Pedido cadastrado com sucesso!')
    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        insertOrderItem(null, orderTableNumber, orderStatus, orderObservation)
        document.getElementById('order-table-number').value = ""
        document.getElementById('order-observation').value = ""
        const container = document.getElementById('selected-items');
        container.innerHTML = '';
        console.log(error)
    }
}


/*
    --------------------------------------------------------------------------------------
    Function to get the list of orders products from the server via GET request
    --------------------------------------------------------------------------------------
*/
const viewOrderProductsByOrderId = async (id) => {
    let url = `${prefixUrl}/order-products/products/${id}`;

    try {
        let response = await fetch(url, {method: 'get'})
        let data = await response.json()

        document.getElementById('modal-order-table-text').textContent = data.table_number;
        document.getElementById('modal-order-status-text').textContent = data.status;
        document.getElementById('modal-order-observation-text').textContent = data.observation;

        // remove itens if exists
        const tableBody = document.getElementById('modal-product-table')
            .getElementsByTagName('tbody')[0];
        tableBody.innerHTML = "";
        
        // insert itens to modal table
        data.products.forEach(item => {
            insrtProductItemInModalTable(item.name, item.amount, item.value)
        })
                
        const modal = new bootstrap.Modal(document.getElementById('order-modal'));
        modal.show();
    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        console.log(error)
    }
}

/*
    --------------------------------------------------------------------------------------
    Function to insert products in table inside order modal
    --------------------------------------------------------------------------------------
*/
const insrtProductItemInModalTable = (name, quantity, value) => {
    const table = document.getElementById('modal-product-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();

    // Insert name and value in table
    [name, quantity, value].forEach(content => {
        const cell = row.insertCell();
        cell.textContent = content;
    });
};


const editOrder = async (id) => {
    let url = `${prefixUrl}/order-products/products/${id}`;

    try {
        let response = await fetch(url, {method: 'get'})
        let data = await response.json()

        document.getElementById('edit-order-table-number').value = data.table_number;
        document.getElementById('edit-order-status').value = data.status;
        document.getElementById('edit-order-observation').value = data.observation;

        data.products.forEach(item => {
            insrtProductItemInEditModalTable(item.name, item.amount, item.value)
        })

        let productUrl = `${prefixUrl}/products`
        let productsResponse = await fetch(productUrl, {method: 'get'})
        let { products } = await productsResponse.json()

        if(!products) {
            alert('Não existem produtos na base de dados');
        }

        products.forEach(item => {insrtProductItemInModalSelectField(item.id, item.name)})

        const modal = new bootstrap.Modal(document.getElementById('edit-order-modal'));
        modal.show();

    } catch (error) {
        alert('Erro ao se comunicar com a base de dados!')
        console.log(error)
    }
}


const addItemToModalOrder = () => {
    const select = document.getElementById('edit-order-itens');
    const quantityInput = document.getElementById('edit-order-quantity');
    const container = document.getElementById('modal-selected-items');

    const selectedOption = select.options[select.selectedIndex];
    const itemName = selectedOption.text;
    const itemId = selectedOption.value;
    const quantity = quantityInput.value;

    if (!itemId || quantity < 1) {
        alert('A quantidade do item deve ser maior ou igual a 1')
        return 
    } 

    // Create wrapper to item
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'input-group mb-2';

    // Field readonly
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control order-product-items';
    input.value = `${itemName} (Qtd: ${quantity})`;
    input.readOnly = true;
    input.setAttribute('data-id', itemId);
    input.setAttribute('data-quantity', quantity);

    // Remove button
    const btnWrapper = document.createElement('button');
    btnWrapper.className = 'btn btn-outline-danger';
    btnWrapper.type = 'button';
    btnWrapper.innerHTML = `<i class="bi bi-x-lg" id="remove-buton-${itemId}"></i>`;
    btnWrapper.onclick = () => container.removeChild(itemWrapper);

    itemWrapper.appendChild(input);
    itemWrapper.appendChild(btnWrapper);

    container.appendChild(itemWrapper);
}


const insrtProductItemInEditModalTable = (name, quantity, value) => {
    const table = document.getElementById('modal-already-product-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();

    // Insert name and value in table
    [name, quantity, value].forEach(content => {
        const cell = row.insertCell();
        cell.textContent = content;
    });
};


/*
    --------------------------------------------------------------------------------------
    Function inserts products in select field
    --------------------------------------------------------------------------------------
*/
const insrtProductItemInModalSelectField = (id, name) => {
    const select = document.getElementById('edit-order-itens');
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    select.appendChild(option);
}

/*
    --------------------------------------------------------------------------------------
    Function to insert orders in table
    --------------------------------------------------------------------------------------
*/
const insertOrderItem = (id = 0, table_number, status, observation) => {
    const table = document.getElementById('order-table')
        .getElementsByTagName('tbody')[0];

    const row = table.insertRow();
    const normalizedStatus = status.toLowerCase().replace(/\s/g, '_');
    row.setAttribute("id", `order-${id}`);
    // Set classe to change background color by status
    row.setAttribute("class", `status-${normalizedStatus}`);

    // Insert name and value in table
    [table_number, status, observation].forEach(content => {
        const cell = row.insertCell();
        cell.textContent = content;
    });

    // Insert action buttons
    const actionCell = row.insertCell();
    actionCell.innerHTML = `
        <button class="btn btn-sm btn-primary me-2" onclick="viewOrderProductsByOrderId(${id})">
            <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-primary me-2" onclick="editOrder(${id})">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteOrder(${id})">
            <i class="bi bi-trash"></i>
        </button>
    `;
};