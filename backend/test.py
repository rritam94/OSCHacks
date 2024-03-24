from email.mime import image
import re
from openai import OpenAI

client = OpenAI()
from time import time, sleep
import textwrap
import yaml
import base64
import requests


###     file operations

def save_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as outfile:
        outfile.write(content)


def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
        return infile.read()
    

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
    

if __name__ == '__main__':
    #Fix this here, need to make txt file, bad implemenetation
    Monday = []
    Tuesday = []
    Wednesday = []
    Thursday = []
    Friday = []
    Saturday = []
    Sunday = []
    taskMon = []

    Schedule = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, taskMon]
    
    client.api_key = open_file('./backend/API_KEY.txt').strip()
    
    conversation = list()
    conversation.append({'role': 'system', 'content': open_file('./backend/OutPutRules.md')})
    user_messages = list()
    all_messages = list()
    print('What would you like to do')
    
    ## INTAKE PORTION
    
    while True:
        # get user input
        text = input('\n\nPATIENT: ').strip()
        if text == 'DONE':
            break
        user_messages.append(text)
        all_messages.append('PATIENT: %s' % text)
        conversation.append({'role': 'user', 'content': text})
        response, tokens = chatbot(conversation)
        conversation.append({'role': 'assistant', 'content': response})
        all_messages.append('INTAKE: %s' % response)
        print('\n\nINTAKE: \n ', response)

        response.strip()
        response = response.replace('-', "")
        response = response.split(":")
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

            
print(Schedule)