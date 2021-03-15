from flask import Flask, render_template, request, json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/figure/')
def figure():
    return render_template('canvas.html')

@app.route('/dataFigure', methods=['POST'])
def dataFigure():
    coordX = []
    coordY = []
    nRobots = request.form['nBots']
    #coordX = request.form['posX']
    #coordY = request.form['posY']
    coordX.append(request.form['posX'])
    coordY.append(request.form['posY'])
    return json.dumps({'status':'OK','nRobots': nRobots,'coordX': coordX,'coordY': coordY})

if __name__ == '__main__':
    app.run()