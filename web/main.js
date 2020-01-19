let pages = ['homePage', 'tablePage', 'dishPage', 'orderPage', 'createTablePage', 'editTablePage', 'dishCreatePage', 'editDishPage', 'createOrderPage'];
let currentOrders = "";
function managePage(name) {
    pages.forEach((page) => {
        document.getElementById(page).style.display = 'none';
    });
    document.getElementById(name).style.display = 'block';

    if (name == pages[1]) {
        loadTable();
    } else if (name == pages[2]) {
        loadDish();
    } else if (name == pages[8]) {
        loadOptionList();
    }
}
managePage('homePage');

function loadOptionList(){
    eel.getTablesAndDishes()(function (data) {
        create_roder_table_name = document.querySelector("#create_roder_table_name");
        create_roder_dish_name = document.querySelector("#create_roder_dish_name");
        tbStr = "";
        data.tables.forEach((table)=>{
            tbStr += `
                <option value="${table.id}">${table.name}</option>
            `
        });
        create_roder_table_name.innerHTML = tbStr;

        diStr = "";
        data.dishes.forEach((dish)=>{
            diStr += `
                <option value="${dish.id}">${dish.name}</option>
            `
        });
        create_roder_dish_name.innerHTML = diStr;
    })
}
create_order_btn = document.querySelector("#create_order_btn");
create_order_btn.addEventListener('click',function(event){
    event.preventDefault();
    let table_id = document.querySelector("#create_roder_table_name").value;
    let dish_id = document.querySelector("#create_roder_dish_name").value;
    let dish_count = document.querySelector("#create_order_count").value;

    eel.createOrder(dish_id,table_id,dish_count)(function(tableId){
        loadOrderByTable(tableId);
    })
})

function loadOrderByTable(id){
   let orderBodyData = document.querySelector("#orderBodyData");
   let orderStr = "";
    eel.getOrdersByTable(id)(function(data){
        currentOrders = data;
        let grandTotal = 0;
       data.forEach((order)=>{
           grandTotal += order.price * order.count;
           orderStr += `
            <tr>
                    <td>${order.id}</td>
                    <td>${order.dish_name}</td>
                    <td>${order.table_name}</td>
                    <td>${order.price}</td>
                    <td>${order.count}</td>
                    <td>${order.price * order.count}</td>
                </tr>
           `;
       });
        orderBodyData.innerHTML = orderStr;
        document.querySelector("#grandTotal").innerHTML = grandTotal;
        managePage(pages[3]);
    });
}

function billOut(){
    window.print();
    // currentOrders.forEach((order)=>{
    //     eel.updateOrderStatus(order.id)(function (data) {
    //             console.log("Order id " + order.id + " deleted!");
    //     })
    // });
    // managePage(pages[1]);
}

function loadDish() {
    eel.getDishes()(function (data) {
        dishStr = "";
        data.forEach((dish) => {
            let colored = dish.status == 1 ? 'success' : 'secondary';
            dishStr += `
                <tr>
                    <td>${dish.id}</td>
                    <td>${dish.name}</td>
                    <td>${dish.price}</td>
                    <td><button class="btn btn-${colored} btn-sm" onclick="dishStatusChange(${dish.status},${dish.id})">${dish.status}</button></td>
                    <td>
                        <button class="btn btn-warning" onclick="editDish(${dish.id})"><i class="fa fa-edit"></i></button>
                        <button class="btn btn-danger" onclick="deleteDish(${dish.id})"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        document.querySelector("#dishBodyData").innerHTML = dishStr;
    })
}

function dishStatusChange(status, id) {
    status = status == 0 ? 1 : 0;
    eel.dishStatusUpdate(id, status)(function (data) {
        loadDish();
    });
}

function loadTable() {
    eel.getTables()(function (data) {
        tableStr = '';
        data.forEach((table) => {
            let bb = table.status == 1 ? 'success' : 'secondary';
            tableStr += `
             <tr>
                    <td>${table.id}</td>
                    <td>${table.name}</td>
                    <td>
                       <button class="btn btn-${bb} btn-sm" onclick="updateTableStatus(${table.id},${table.status})">${table.status}</button>
                        <button class="btn btn-info btn-sm" onclick="loadOrderByTable(${table.id})">See Order</button>
                    </td>
                    <td>
                       <button class="btn btn-warning btn-sm" onclick="getTableById(${table.id})"><i class="fa fa-edit"></i></button>
                       <button class="btn btn-danger btn-sm" onclick="deleteTable(${table.id})"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        document.querySelector("#tableBodyData").innerHTML = tableStr;
    })
}

function deleteTable(id) {
    eel.deleteTable(id)(function (data) {
        loadTable();
    })
}

create_table_btn = document.querySelector("#create_table_btn");
create_table_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let table_name = document.querySelector("#create_table_name").value;
    eel.createTable(table_name)(function () {
        loadTable();
        managePage(pages[1]);
        document.querySelector("#create_table_name").value = "";
    })
});


function getTableById(id) {
    eel.getTableById(id)(function (table) {
        document.querySelector("#edit_table_name").value = table.name;
        document.querySelector("#edit_table_id").value = table.id;
        managePage(pages[5])
    });
}

edit_table_btn = document.querySelector("#edit_table_btn");
edit_table_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let new_table_name = document.querySelector("#edit_table_name").value;
    let table_id = document.querySelector("#edit_table_id").value;
    eel.updateTable(table_id, new_table_name)(function (data) {
        loadTable();
        managePage(pages[1]);
    });
})

function updateTableStatus(id, status) {
    status = status == 1 ? 0 : 1;
    eel.updateTableStatus(id, status)(function (data) {
        loadTable();
    })
}
create_dish_btn = document.querySelector("#create_dish_btn");
create_dish_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let dish_name = document.querySelector("#create_dish_name").value;
    let dish_price = document.querySelector("#create_dish_price").value;

    eel.createDish(dish_name, dish_price)(function (data) {
        loadDish();
        managePage(pages[2]);
        document.querySelector("#create_dish_name").value = "";
        document.querySelector("#create_dish_price").value = "";
    })
});

function editDish(id) {
    eel.getDishById(id)(function (data) {
        document.querySelector("#edit_dish_name").value = data.name;
        document.querySelector("#edit_dish_price").value = data.price;
        document.querySelector("#edit_dish_id").value = data.id;
        managePage(pages[7]);
    });
}

edit_dish_btn = document.querySelector("#edit_dish_btn");
edit_dish_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let name = document.querySelector("#edit_dish_name").value;
    let price = document.querySelector("#edit_dish_price").value;
    let id = document.querySelector("#edit_dish_id").value;

    eel.updateDish(name, price, id)(function (data) {
        loadDish();
        managePage(pages[2]);
    });
});

function deleteDish(id) {
    eel.deleteDish(id)(function (data) {
        loadDish();
    });
}

