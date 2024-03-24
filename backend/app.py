from flask import Flask
from flask_socketio import SocketIO, emit
import torch
import cv2
import pandas as pd
import time
from flask_cors import cross_origin, CORS
from ultralytics import YOLO
import threading
from gtts import gTTS
import os

app = Flask(__name__)
socketio = SocketIO(app)
CORS(app, origins=['http://localhost:3000'])

@app.route('/start', methods=['GET'])
def start_action():
    # Perform action when start button is pressed
    # Add your logic here
    return 'Action started'

# yolo model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s') 
cap = cv2.VideoCapture(0)

def increaseInBoundingBox(areas):
    for i in range(0, len(areas)):
        for j in range(1, len(areas)):
            if areas[i][j] > areas[i][j-1]:
                return False
            
    return True

def inRadius(area):
    totalArea = 640 * 640
    if area/totalArea >= .50:
        return True
    else:
        return False
    
def side(coor):
    if 0 < coor < 200:
        return 'left'
    elif 200 < coor < 400:
        return 'straight ahead'
    else:
        return 'right'

def updateDF():
    global cap
    global model

    ritam_start = time.time()

    while True:
        img = cap.read()[1]
        if img is None:
            break
        result = model(img)
        x1 = []
        y1 = []
        x2 = [] 
        y2 = [] 
        area = [] 
        label = []
        text = []
        conf = []

        df = result.pandas().xyxy[0]
        #print(len(df)) #gives the number of objects detected by model

        for ind in df.index:
            x1.append(int(df['xmin'][ind]))
            y1.append(int(df['ymin'][ind]))
            x2.append(int(df['xmax'][ind]))
            y2.append(int(df['ymax'][ind]))
            area.append(float(abs(x1[ind] - x2[ind]) * abs(y1[ind]- y2[ind])))
            label.append(df['name'][ind])
            conf.append(df['confidence'][ind])
            text.append(label[ind] + ' ' + str(conf[ind].round(decimals= 2)))

            cv2.rectangle(img, (x1[ind], y1[ind]), (x2[ind], y2[ind]), (255, 255, 0), 2)
            cv2.putText(img, text[ind], (x1[ind], y1[ind] - 5), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 0), 2)
        
        askingToCross = True #replace with some functionality
        rightCounter = 0
        leftCounter = 0
        for ind in df.index:
            if inRadius(area[ind]):
                print(label[ind], "is approaching from the", side((x2[ind]-x1[ind])/2))
        if askingToCross:
            start_time = time.time()
            captureTime = time.time()

            areasLeft =  [[],[],[],[],[],[]]
            areasRight = [[],[],[],[],[],[]]
            print("LEFT")
            while time.time() <= start_time + 5:
                img = cap.read()[1]
                if img is None:
                    break
                result = model(img)
                x1 = []
                y1 = []
                x2 = [] 
                y2 = [] 
                area = [] 
                label = []
                text = []
                conf = []

                df = result.pandas().xyxy[0]
                #print(len(df)) #gives the number of objects detected by model

                for ind in df.index:
                    x1.append(int(df['xmin'][ind]))
                    y1.append(int(df['ymin'][ind]))
                    x2.append(int(df['xmax'][ind]))
                    y2.append(int(df['ymax'][ind]))
                    area.append(float(abs(x1[ind] - x2[ind]) * abs(y1[ind]- y2[ind])))
                    label.append(df['name'][ind])
                    conf.append(df['confidence'][ind])
                    text.append(label[ind] + ' ' + str(conf[ind].round(decimals= 2)))

                    cv2.rectangle(img, (x1[ind], y1[ind]), (x2[ind], y2[ind]), (255, 255, 0), 2)
                    cv2.putText(img, text[ind], (x1[ind], y1[ind] - 5), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 0), 2)
                
                if time.time() < start_time + 2.5:
                    print("LEFT")
                    '''
                    print(len(label), " == ", len(area))
                    print("AREAS LEFT", len(areasLeft), "COUNTER", leftCounter)
                    if time.time() == captureTime + .5:
                        for i in range(0, len(label)):
                            print(i)
                            areasLeft[leftCounter].append(area[i])
                        leftCounter += 1
                        captureTime = time.time()
                    '''

                if time.time() > start_time + 2.5:
                    print("RIGHT")
                    '''
                     if time.time() == captureTime + .5:
                        for j in range(0, len(label)):
                            areasRight[rightCounter].append(area[j])
                        rightCounter += 1
                        captureTime = time.time()
                    
                    '''
                   
            areasLeft = [[1,2,3],[1,2,3],[1,2,3]]
            areasRight = [[1,2,3],[1,2,3],[1,2,3]]
            if (time.time() - ritam_start) % 10 == 0:
                if increaseInBoundingBox(areasLeft) or increaseInBoundingBox(areasRight):
                    gTTS(text = "NOT SAFE TO CROSS").save("NOT_SAFE.mp3")
                    os.system("mpg321 NOT_SAFE.mp3")
                
                else:
                    gTTS(text = "SAFE").save("SAFE.mp3")
                    os.system("mpg321 SAFE.mp3")
                

        cv2.imshow('Video',img)
        cv2.waitKey(10)

# Start the YOLO algorithm in a separate thread
yolo_thread = threading.Thread(target=updateDF)
yolo_thread.daemon = True
yolo_thread.start()

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
