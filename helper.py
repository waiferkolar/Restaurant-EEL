from db import *
from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)
session = Session()

def create(obj):
    session.add(obj)
    session.commit()

def all(obj):
    return session.query(obj).all()

def findById(obj,id):
    return session.query(obj).get(id)

def update():
    session.commit()

def destory(obj):
    session.delete(obj)
    session.commit()
    
def search(obj,id):
    return session.query(obj).filter(Order.table_id == id, Order.status == 1).all()

