from sqlalchemy import create_engine, Column, Integer,String,ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

engine = create_engine("sqlite:///tesla.db",echo=True)

Base = declarative_base()

class Dish(Base):
    __tablename__ = "dishes"

    id = Column(Integer,primary_key=True)
    name = Column(String,nullable=False)
    price = Column(Integer,nullable=False)
    status = Column(Integer,default=1)

class Table(Base):
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    status = Column(Integer, default=1)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    dish_id = Column(Integer,ForeignKey("dishes.id"))
    table_id = Column(Integer,ForeignKey("tables.id"))
    price = Column(Integer, nullable=False)
    order_count = Column(Integer,default=1)
    dish = relationship("Dish",back_populates="orders")
    table = relationship("Table",back_populates="orders")
    status = Column(Integer, default=1)

Dish.orders = relationship("Order",back_populates="dish")
Table.orders = relationship("Order",back_populates="table")

Base.metadata.create_all(engine)


