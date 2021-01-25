# import numpy as np
# import datetime as dt

# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func

# from flask import Flask, jsonify


# #################################################
# # Database Setup
# #################################################
# engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)

# # Save reference to the table
# measurement = Base.classes.measurement
# station = Base.classes.station

# #################################################
# # Flask Setup
# #################################################
# app = Flask(__name__)


# #################################################
# # Flask Routes
# #################################################

# @app.route("/")
# def welcome():
#     """List all available api routes."""
#     return (
#         f"Available Routes:<br/>"
#         f"/api/v1.0/mlb_data<br/>"
#         f"/api/v1.0/Salaries<br/>"
#         f"/api/v1.0/Teams<br/>"
#     )


# @app.route("/api/v1.0/mlb_data")
# def mlb_data():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     """Return a list of all passenger names"""
#     # Query all dates and precipitation
#     results = session.query(mlb_data.year, 
#                             mlb_data.team, 
#                             mlb_data.team_salary, 
#                             mlb_data.avg_player_salary, 
#                             mlb_data.median_player_salary, 
#                             mlb_data.wins, 
#                             mlb_data.cost_per_win, 
#                             mlb_data.championship).all()

#     session.close()

#     # Convert to Dictionary
#     mlb = []
#     for date, prcp in results:
#         mlb_dict = {}
#         prcp_dict["date"] = date
#         prcp_dict["prcp"] = prcp
#         precip.append(prcp_dict)

#     return jsonify(precip)


# @app.route("/api/v1.0/stations")
# def stations():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

    
#     # Query all stations
#     results = session.query(station.name).all()

#     session.close()

#     # Create a list of stations
#     all_stations = list(np.ravel(results))
    
#     return jsonify(all_stations)

# @app.route("/api/v1.0/tobs")
# def tobs():
    
#     # Create our session (link) from Python to the DB
    
#     session = Session(engine)
    
#     #define last year
#     last_year = dt.date(2017, 8, 23)- dt.timedelta(days =365)
    
#     #query of last year of temps for most active station
    
#     results = session.query(measurement.date, measurement.tobs).\
#         filter(measurement.date >= last_year).\
#         filter(measurement.station == 'USC00519281').all()

    
#     #close session
    
#     session.close()
    
#     #convert to dictionary
#     all_temps = []
#     for date, tobs in results:
#         temp_dict = {}
#         temp_dict["date"] = date
#         temp_dict["tobs"] = tobs
#         all_temps.append(temp_dict)
    
#     #jsonify
    
#     return jsonify(all_temps)


# @app.route("/api/v1.0/<start>")
# def start(start):
    
#     # Create our session (link) from Python to the DB
    
#     session = Session(engine)

#     #query start to current tmin, tavg, and tmax
    
#     results = session.query(measurement.date,\
#         func.min(measurement.tobs),\
#         func.avg(measurement.tobs),\
#         func.max(measurement.tobs)).\
#         filter(measurement.date >= start).\
#         group_by(measurement.date).all()

#     #close session

#     session.close()
    
#     #convert to a dictionary
    
#     start_temps = []
    
#     for date, t_min, t_avg, t_max in results:
#         start_temps_dict = {}
#         start_temps_dict["date"] = date
#         start_temps_dict["min"] = t_min
#         start_temps_dict["avg"] = t_avg
#         start_temps_dict["max"] = t_max
#         start_temps.append(start_temps_dict)
    
#     return jsonify(start_temps) 
    
#     #jsonify
    
#     return jsonify(start_temps)


# @app.route("/api/v1.0/<start>/<end>")
# def start_end(start, end):
    
#     # Create our session (link) from Python to the DB
    
#     session = Session(engine)
    
#     #query start date to end date tmin, tavg, and tmax
    
#     results = session.query(measurement.date,\
#         func.min(measurement.tobs),\
#         func.avg(measurement.tobs),\
#         func.max(measurement.tobs)).\
#         filter(measurement.date >= start).\
#         filter(measurement.date <= end).\
#         group_by(measurement.date).all()

#     #close session

#     session.close()
    
#     #convert to a dictionary
    
#     start_end_temps = []
    
#     for date, t_min, t_avg, t_max in results:
#         start_end_temps_dict = {}
#         start_end_temps_dict["date"] = date
#         start_end_temps_dict["min"] = t_min
#         start_end_temps_dict["avg"] = t_avg
#         start_end_temps_dict["max"] = t_max
#         start_end_temps.append(start_end_temps_dict)
    
#     #jsonify
    
#     return jsonify(start_end_temps)

# #run app

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, render_template, jsonify
import data
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')


@app.route('/')
def home():
    return render_template('base.html')


@app.route('/db_data', methods=['GET'])
def database_data():
    # data = data.get_db_data()
    data = {"this": "is my database data"}
    return jsonify(data)


@app.route('/api_data', methods=['GET'])
def api_data():
    # data = data.get_api_data()
    data = {"this": "is my api data"}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
    