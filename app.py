# import necessary libraries
import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, Float, inspect


from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///diabetes.sqlite"
db = SQLAlchemy(app)

class Data(db.Model):
    __tablename__ = 'data'
    id = Column(Integer, primary_key=True)
    Year = Column(Integer)
    LocationAbbr = Column(String(255))
    LocationDesc = Column(String(255))
    Question = Column(String(255))
    DataValue = Column(Float)
    Gender = Column(String(255))
    Average = Column(Integer)
    AbbrQuestion = Column(String(255))

# create route that renders index.html template
@app.route('/')
def home():
    return render_template("index.html")

@app.route('/data')
def data():
    """List of dictionaries of data entries"""
    data_query = db.session.query(Data.Year, Data.LocationAbbr, Data.LocationDesc, 
        Data.Question, Data.DataValue, Data.Gender, Data.Average, Data.AbbrQuestion).all()
    list = []
    x = 0
    for d in data_query:
        query = {}
        query["Year"] = data_query[x][0]
        query["LocationAbbr"] = data_query[x][1]
        query["LocationDesc"] = data_query[x][2]
        query["Question"] = data_query[x][3]
        query["DataValue"] = data_query[x][4]
        query["Gender"] = data_query[x][5]
        query["Average"] = data_query[x][6]
        query["AbbrQuestion"] = data_query[x][7]
        list.append(query)
        x+=1
    return jsonify(list)

if __name__ == "__main__":
    app.run()