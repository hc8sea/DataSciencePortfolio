import os
import json
import time

import spotipy
import openai
import pandas as pd 
import plotly
import plotly.express as px
import plotly.graph_objects as go
import tensorflow as tf
import cv2

from flask import Flask, render_template, request, send_file, jsonify
from spotipy.oauth2 import SpotifyClientCredentials

from tqdm import tqdm

import credentials
from modules.recommender import create_dataset, create_model
from modules.acoustic import input_to_prediction, name_to_url, url_to_melspec, preprocess_mel, mel_to_prediction
from modules.dashboard import run_script
top_tracks = []



spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

#TODO style buttons
#TODO pbar for everyone
#TODO 
#TODO
#TODO


app = Flask(__name__)

global bar
bar = [0]
@app.route("/get_progress")
def get_progress():
    return jsonify(progress = bar)

@app.route('/', methods=['GET','POST'])
def index():

    global full_log
    full_log = []
    if request.method == "POST":
        if 'todo' in request.form:
            print('1there is')
            print(request.form)
            global input_name #why?
            input_name = request.form.get("todo")
            global graphJSON



            # graphJSON = run_script(input_name)
        else:
            print('2there is')
            print(request.form.getlist('checkboxes'))
            # global selected_tracks
            # selected_tracks = request.form.getlist('checkboxes')

    return render_template('index.html')

@app.route('/predef1')
def predef1():
    with open('radiohead.json', 'r') as openfile:
        jsonfile = json.load(openfile)
    return jsonfile

@app.route("/fetch_data")
def fetch_data():
  data = []
  for i in range(100):
    # Generate data
    data.append(i)
    time.sleep(0.5)
  return jsonify(data)



@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.get_json()
    selected_tracks = data['data']['checkbox_items']
    print(selected_tracks)
    app.selected_tracks = selected_tracks

    try:
        ratings, movies = create_dataset(input_name, selected_tracks, bar)
    except:
        ratings, movies = create_dataset('Radiohead', selected_tracks, bar)
        
    recommendation = create_model(ratings, movies, selected_tracks)

    return jsonify(rec=recommendation)

@app.route('/data')
def data():
    _ = run_script(input_name)
    return _

@app.route('/rec0')
def rec0():
    artist_results = spotify.search(q='artist:' + 'Radiohead', type='artist')
    artist_id = artist_results['artists']['items'][0]['id']
    global top_tracks
    top_tracks = [
        track['name'] for track in spotify.artist_top_tracks(artist_id)['tracks']
        ]
    return jsonify(top_tracks)

@app.route('/rec')
def rec():
    artist_results = spotify.search(q='artist:' + input_name, type='artist')
    artist_id = artist_results['artists']['items'][0]['id']
    global top_tracks
    top_tracks = [
        track['name'] for track in spotify.artist_top_tracks(artist_id)['tracks']
        ]
    return jsonify(top_tracks)

# @app.route('/rec2', methods=['POST','GET'])
# def rec2():
#     # selected_tracks = request.form.getlist('checkboxes')
#     app.selected_tracks = selected_tracks
#     print(selected_tracks)
#     print(request.form)
#     ratings, movies = create_dataset(input_name, selected_tracks)
#     recommendation = create_model(ratings, movies, selected_tracks)

#     return jsonify(recommendation)

@app.route('/classifier', methods=['GET','POST'])
def classifier():
    input_name = request.get_json()['data']

    prediction = input_to_prediction(input_name)
    model = tf.keras.models.load_model('model')
    summary = model.summary()
    url = name_to_url(input_name)[0]
    mel, width = url_to_melspec(url, 128)
    mel_ = preprocess_mel(mel)
    prediction = mel_to_prediction(mel_)
    height = 512
    mel2, width = url_to_melspec(url, height)
    mel__ = 255*((mel2+80)/80)[:,:height] #to form a square

    mel__ = cv2.cvtColor(mel__, cv2.COLOR_GRAY2RGBA).astype('uint8')

    mel__ = json.dumps(mel__.tolist())
    
    return jsonify(string=prediction, array=mel__, height=height, width=width)

@app.route('/nlp', methods=['GET','POST'])
def nlp():

    print(full_log)
    prompt = request.get_json()['data']
    raw_completion = openai.Completion.create(
        model='ada:ft-personal-2022-12-30-04-55-39',
        prompt=f'{prompt} ->')
    filtered_completion = raw_completion.choices[0]['text'].split('\n')[0][1:]
    full_log.append(prompt)
    full_log.append(filtered_completion)
    partial_log = full_log[:-1]
    words = filtered_completion.split(" ")
    return jsonify(partial_log, words)

@app.route('/recommender', methods=['GET','POST'])
def recommender():
    if request.method=='GET':
        artist_results = spotify.search(q='artist:' + input_name, type='artist')
        artist_id = artist_results['artists']['items'][0]['id']
        global top_tracks
        top_tracks = [
            track['name'] for track in spotify.artist_top_tracks(artist_id)['tracks']
            ]
    
        return render_template('recommender.html',top_tracks=top_tracks)
    else:
        selected_tracks = request.form.getlist('checkboxes')
        app.selected_tracks = selected_tracks
        
        ratings, movies = create_dataset(input_name, selected_tracks)
        recommendation = create_model(ratings, movies, selected_tracks)

        return render_template('recommender.html', top_tracks=top_tracks, recommendation=recommendation)

@app.route('/gpt3', methods=['GET','POST'])
def gpt3():
    if request.method=='GET':

        global full_log
        full_log = []
        return render_template('gpt3.html')
    else:
        msg='post'
        prompt = request.form['input_text']
        raw_completion = openai.Completion.create(
            model='ada:ft-personal-2022-12-30-04-55-39',
            prompt=f'{prompt} ->')
        filtered_completion = raw_completion.choices[0]['text'].split('\n')[0][1:]
        full_log.append(prompt)
        full_log.append(filtered_completion)
        partial_log = full_log[:-1]
        words = filtered_completion.split(" ")
        return render_template('gpt3.html', partial_log=partial_log, words=words)

@app.route('/acoustic', methods=['GET','POST'])
def acoustic():
    if request.method=='POST':
        input_name = request.form['input4']
        prediction = input_to_prediction(input_name)
        model = tf.keras.models.load_model('model')
        summary = model.summary()
        url = name_to_url(input_name)[0]
        mel = url_to_melspec(url)
        mel = preprocess_mel(mel)

        prediction = mel_to_prediction(mel)
        return render_template('acoustic.html', prediction=prediction, summary=str(summary))
    else:
        return render_template('acoustic.html')
  
if __name__ == '__main__':
    app.run(threaded=True)
