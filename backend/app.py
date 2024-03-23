from flask import Flask

app = Flask(__name__)

@app.route('/start', methods=['GET'])
def start_action():
    # Perform action when start button is pressed
    # Add your logic here
    return 'Action started'

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app
