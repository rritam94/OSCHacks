from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from flask_cors import cross_origin
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import datetime as dt
import yfinance as yf
from datetime import datetime
import numpy as np
import requests

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    # some func
    x = 2
    
if __name__ == '__main__':
    app.run()
