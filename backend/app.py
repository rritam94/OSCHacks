from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from openai import OpenAI
import torch
import cv2
import pandas as pd
import time
from flask_cors import cross_origin, CORS
from ultralytics import YOLO
import threading
from gtts import gTTS
import os
from email.mime import image
import re
client = OpenAI(api_key = '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' )
from time import time, sleep
import textwrap
import yaml
import base64
import requests
from dotenv import load_dotenv


app = Flask(__name__)
socketio = SocketIO(app)
CORS(app, origins=['http://localhost:3000'])

@app.route('/start', methods=['GET'])
def start_action():
    # Perform action when start button is pressed
    # Add your logic here
    return 'Action started'

def chatbot(conversation, model="gpt-4-0613", temperature=0, max_tokens=2000):
    max_retry = 7
    retry = 0
    while True:
        try:
            response = client.chat.completions.create(model=model, messages=conversation, temperature=temperature, max_tokens=max_tokens)
            text = response.choices[0].message.content
            
            return text, response.usage.total_tokens
        except Exception as oops:
            print(f'\n\nError communicating with OpenAI: "{oops}"')
            exit(5)

def AddToSchedule(day, finalDate):
    day.append(finalDate)

def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
        return infile.read()
    
def save_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as outfile:
        outfile.write(content)

@app.route('/schedule', methods=['POST', 'GET'])
def scheduler():
    data = request.get_json()

    Monday = []
    Tuesday = []
    Wednesday = []
    Thursday = []
    Friday = []
    Saturday = []
    Sunday = []
    taskMon = []

    Schedule = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, taskMon]


    load_dotenv()  # take environment variables from .env.
    client.api_key = os.getenv('API_KEY')
    #os.environ['OPENAI_API_KEY'] = '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'

    
    conversation = list()
    conversation.append({'role': 'system', 'content': open_file('OutPutRules.md')})
    user_messages = list()
    all_messages = list()
    
    ## INTAKE PORTION
    
    text = data.get("transcription")
    user_messages.append(text)
    all_messages.append('PATIENT: %s' % text)
    conversation.append({'role': 'user', 'content': text})
    response, tokens = chatbot(conversation)
    conversation.append({'role': 'assistant', 'content': response})
    all_messages.append('INTAKE: %s' % response)
    print('\n\nINTAKE: \n ', response)

    response.strip()
    response = response.replace('-', "")
    response = response.split(";")
    print(response)


    if response[0] == "EVENT" or response[0] == "TASK":
        print("TRUE")
        
        for i in response:
            i.strip()
            if len(i) == 1:
                response.remove(i)
            
        print(response[3])
        if response[0] == 'EVENT':
            print("EVENT")
            if response[3] == "Monday" or response[3] == "monday":
                Monday.append(response)
                print("Added")
            elif response[3] == "Tuesday" or response[3] == "tuesday":
                Tuesday.append(response)
            elif response[3] == "Wednesday" or response[3] == "wednesday":
                Wednesday.append(response)
            elif response[3] == "Thursday" or response[3] == "thursday":
                Thursday.append(response)
            elif response[3] == "Friday" or response[3] == "friday":
                Friday.append(response)
            elif response[3] == "Saturday" or response[3] == "saturday":
                Saturday.append(response)
            elif response[3] == "Sunday" or response[3] == "sunday":
                Sunday.append(response)
            
            elif response[0] == 'TASK':
                print("Task")
                taskMon.append(response)

    print (Monday)
    
    if len(Monday) >= 3:
        if Monday[3] == 'Monday' or Monday[3] == 'monday':
                return jsonify({"monday": Monday, "response": "You're schedule is set!"})
    
        else:
            return jsonify({"response": response})
    
    else:
        return jsonify({"response": response})



if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
