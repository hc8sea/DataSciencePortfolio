import requests
import librosa
from tqdm import tqdm
import tensorflow as tf
import credentials
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np

spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


def name_to_url(input_name):

        track_name = input_name
        results = spotify.search(q='track:' + track_name, type='track')
        items = results['tracks']['items']
        track_id = items[0]['id']
        track = spotify.track(track_id)
        print(f'''\nFirst result is "{items[0]['name']}" by "{items[0]['artists'][0]['name']}". The ID is: {track_id}''')
        print(track['preview_url'])
        return track['preview_url']

def url_to_melspec(url):

# Send a GET request to the URL
  response = requests.get(url)

  # Check if the request was successful
  if response.status_code == 200:
      # Save the content of the response to a file
      with open("file.mp3", "wb") as f:
          f.write(response.content)
          y, sr = librosa.load('file.mp3')
          S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
          S_dB = librosa.power_to_db(S, ref=np.max)
          return S_dB
      os.remove('file.mp3')
      print("File downloaded successfully")
  else:
      print("Failed to download file")
  
def preprocess_mel(mel):
    lenght = mel.shape[1]
    mel = [mel[:,i*128:i*128+128] for i in range(lenght//128)]
    mel = [(mel+80)/80 for mel in mel]
    print([mel.shape for mel in mel])
    mel = np.stack(mel, axis=0)
    print(mel.shape)
    return mel

from statistics import mode

def mel_to_prediction(mel):
    model = tf.keras.models.load_model('model')
    pred = model.predict(mel)
    print(np.argmax(pred))
    result = mode([np.argmax(item) for item in pred])
    if result == 0:
        return 'No'
    else:
        return 'Yes'

def input_to_prediction(input_name):
    return f'prediction relativo ao {input_name}'