import eel
from helper import *


eel.init("web")

# ************** For Order Object ********************

@eel.expose
def getTablesAndDishes():
    obj = {"tables":getTables(),"dishes":getDishes()}
    return obj


@eel.expose
def createOrder(dish_id, table_id, order_count):
    currentDish = findById(Dish,dish_id)
    create(Order(dish_id=dish_id, table_id=table_id,
                 price=currentDish.price, order_count=order_count))
    return table_id

@eel.expose
def getOrdersByTable(id):
    resultList = list()
    results = search(Order,id)
    for result in results:
        obj = {"id":result.id,"dish_name":result.dish.name,"table_name":result.table.name,"price":result.price,"count":result.order_count,"status":result.status}
        resultList.append(obj)
        print(obj);

    return resultList

@eel.expose
def updateOrderStatus(id):
    currentObj = findById(Order, id)
    currentObj.status = 0
    update()


def billOut(id):
    results = search(Order, id)
    total = 0
    for result in results:
        total += result.price * result.order_count

    print(f"Bill total is : {total}")


# ************** For Table Object ********************
@eel.expose
def createTable(name):
    create(Table(name=name))


@eel.expose
def deleteTable(id):
    currentObj = findById(Table, id)
    destory(currentObj)


@eel.expose
def getTables():
    resultList = list()
    results = all(Table)
    for result in results:
        obj = {"id": result.id, "name": result.name, "status": result.status}
        resultList.append(obj)
    return resultList


@eel.expose
def getTableById(id):
    result = findById(Table, id)
    return {"id": result.id, "name": result.name, "status": result.status}


@eel.expose
def updateTable(id, name):
    currentObj = findById(Table, id)
    currentObj.name = name
    update()


@eel.expose
def updateTableStatus(id, status):
    currentObj = findById(Table, id)
    currentObj.status = status
    update()

# ************** For Dish Object ********************


@eel.expose
def deleteDish(id):
    currentObj = findById(Dish, id)
    destory(currentObj)


@eel.expose
def updateDish(name, price, id):
    currentDish = findById(Dish, id)
    currentDish.name = name
    currentDish.price = price
    update()


@eel.expose
def getDishById(id):
    result = findById(Dish, id)
    return {"id": result.id, "name": result.name, "price": result.price, "status": result.status}


@eel.expose
def dishStatusUpdate(id, status):
    result = findById(Dish, id)
    result.status = status
    update()


@eel.expose
def getDishes():
    results = all(Dish)
    resultList = list()
    for result in results:
        obj = {"id": result.id, "name": result.name,
               "price": result.price, "status": result.status}
        resultList.append(obj)

    return resultList


@eel.expose
def createDish(name, price):
    create(Dish(name=name, price=price))


eel.start("index.html")


# eel setup and eel communication with javascript
# database => ORM => Object Relational Mapping => sqlalchemy
