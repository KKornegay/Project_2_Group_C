# import dependencies
from flask import Flask, render_template, jsonify
# import data
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


# #################################################
# # Database Setup
# #################################################
engine = create_engine("postgresql://postgres:postgres@localhost:5432/MLB_DB")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# print(dir(Base.classes))
# Save reference to the table
mlb_data = Base.classes.mlb_data
teams = Base.classes.Teams


app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/viz1')
def viz1():
    return render_template('viz1.html')

@app.route('/viz2')
def viz2():
    return render_template('viz2.html')


@app.route('/mlb_data', methods=['GET'])
def get_mlb_data():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all passenger names"""
    # Query all dates and precipitation
    results = session.query(mlb_data.year, 
                            mlb_data.team, 
                            mlb_data.team_salary, 
                            mlb_data.avg_player_salary, 
                            mlb_data.median_player_salary, 
                            mlb_data.wins, 
                            mlb_data.cost_per_win, 
                            mlb_data.championship).all()

    session.close()

    # Convert to Dictionary
    mlb = []
    for year, team, team_salary, avg_player_salary, median_player_salary, wins, cost_per_win, championship in results:
        mlb_dict = {}
        mlb_dict["year"] = year
        mlb_dict["team"] = team
        mlb_dict["team_salary"] = team_salary
        mlb_dict["avg_player_salary"] = avg_player_salary
        mlb_dict["median_player_salary"] = median_player_salary
        mlb_dict["wins"] = wins
        mlb_dict["cost_per_win"] = cost_per_win
        mlb_dict["championship"] = championship
        mlb.append(mlb_dict)

    return jsonify(mlb)

@app.route('/teams', methods=['GET'])
def get_teams():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all passenger names"""
    # Query all dates and precipitation
    results = session.query(teams.yearID, 
                            teams.lgID, 
                            teams.teamID, 
                            teams.franchID, 
                            teams.divID, 
                            teams.Ranks, 
                            teams.Gs, 
                            teams.Ghome,
                            teams.W,
                            teams.L,
                            teams.DivWin,
                            teams.WCWin,
                            teams.LgWin,
                            teams.WSWin,
                            teams.R,
                            teams.AB,
                            teams.H,
                            teams.two_B,
                            teams.three_B,
                            teams.HR,
                            teams.BB,
                            teams.SO,
                            teams.SB,
                            teams.CS,
                            teams.HBP,
                            teams.SF,
                            teams.RA,
                            teams.ER,
                            teams.ERA,
                            teams.CG,
                            teams.SHO,
                            teams.SV,
                            teams.IPouts,
                            teams.HA,
                            teams.HRA,
                            teams.BBA,
                            teams.SOA,
                            teams.E,
                            teams.DP,
                            teams.FP,
                            teams.name,
                            teams.park,
                            teams.attendance,
                            teams.BPF,
                            teams.PPF,
                            teams.teamIDBR,
                            teams.teamIDlahman45,
                            teams.teamIDretro).all()

    session.close()

    # Convert to Dictionary
    mlb = []
    for year, team, team_salary, avg_player_salary, median_player_salary, wins, cost_per_win, championship in results:
        mlb_dict = {}
        mlb_dict["year"] = year
        mlb_dict["team"] = team
        mlb_dict["team_salary"] = team_salary
        mlb_dict["avg_player_salary"] = avg_player_salary
        mlb_dict["median_player_salary"] = median_player_salary
        mlb_dict["wins"] = wins
        mlb_dict["cost_per_win"] = cost_per_win
        mlb_dict["championship"] = championship
        mlb.append(mlb_dict)

    return jsonify(mlb)
# @app.route('/api_data', methods=['GET'])
# def api_data():
#     # data = data.get_api_data()
#     data = {"this": "is my api data"}
#     return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
    
