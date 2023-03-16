import requests
import librosa
from tqdm import tqdm
import tensorflow as tf
import credentials
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
import io
from google.cloud import storage
from urllib.request import urlopen
import pydub

spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Optional: set a generation-match precondition to avoid potential race conditions
    # and data corruptions. The request to upload is aborted if the object's
    # generation number does not match your precondition. For a destination
    # object that does not yet exist, set the if_generation_match precondition to 0.
    # If the destination object already exists in your bucket, set instead a
    # generation-match precondition using its generation number.
    generation_match_precondition = 0

    blob.upload_from_filename(source_file_name, if_generation_match=generation_match_precondition)

    print(
        f"File {source_file_name} uploaded to {destination_blob_name}."
    )


def name_to_url(input_name):

        track_name = input_name
        print(0)
        results = spotify.search(q='track:' + track_name, type='track')
        print(1)
        items = results['tracks']['items']
        track_id = items[0]['id']
        track = spotify.track(track_id)
        global track_found
        track_found = items[0]['name']
        global artist_found
        artist_found = items[0]['artists'][0]['name']
        print(f'''\nFirst result is "{items[0]['name']}" by "{items[0]['artists'][0]['name']}". The ID is: {track_id}''')
        print(track['preview_url'])
        return track['preview_url'], artist_found, track_found

def url_to_melspec(url, n_mels):
  
  wav = io.BytesIO()

  with urlopen(url) as r:
      r.seek = lambda *args: None  # allow pydub to call seek(0)
      pydub.AudioSegment.from_file(r).export(wav, "wav")

  wav.seek(0)
  y, sr = librosa.load(wav)
  S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, fmax=8000)
  S_dB = librosa.power_to_db(S, ref=np.max)
  width = S_dB.shape[1]
  return S_dB, width
# Send a GET request to the URL
  response = requests.get(url)
#   print(url)
  # Check if the request was successful
  if response.status_code == 200:

        y, sr = librosa.load(response.content)
        S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, fmax=8000)
        S_dB = librosa.power_to_db(S, ref=np.max)
        width = S_dB.shape[1]
        return S_dB, width

#     # Save the content of the response to a file
#     with open("file.mp3", "wb") as f:
#         f.write(response.content)
#         y, sr = librosa.load('file.mp3')
#         S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, fmax=8000)
#         S_dB = librosa.power_to_db(S, ref=np.max)
#         width = S_dB.shape[1]
#         return S_dB, width
#     os.remove('file.mp3')
#     print("File downloaded successfully")
#   else:
#     print("Failed to download file")
  
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
        return f'{track_found} by {artist_found} is not an acoustic song.'
    else:
        return f'{track_found} by {artist_found} is actually an acoustic song!'

def input_to_prediction(input_name):
    return f'prediction relativo ao {input_name}'
