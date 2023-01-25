import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from typing import Dict, Text

import numpy as np
import tensorflow as tf

import tensorflow_recommenders as tfrs
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

class MovieLensModel(tfrs.Model):
  # We derive from a custom base class to help reduce boilerplate. Under the hood,
  # these are still plain Keras Models.

  def __init__(
      self,
      user_model: tf.keras.Model,
      movie_model: tf.keras.Model,
      task: tfrs.tasks.Retrieval):
    super().__init__()

    # Set up user and movie representations.
    self.user_model = user_model
    self.movie_model = movie_model

    # Set up a retrieval task.
    self.task = task

  def compute_loss(self, features: Dict[Text, tf.Tensor], training=False) -> tf.Tensor:
    # Define how the loss is computed.

    user_embeddings = self.user_model(features["user_id"])
    movie_embeddings = self.movie_model(features["movie_title"])

    return self.task(user_embeddings, movie_embeddings)

def create_dataset(input_name, selected_tracks):        
    artist_results = spotify.search(q='artist:' + input_name, type='artist')
    artist_id = artist_results['artists']['items'][0]['id']
    print(artist_id)
    top_tracks = [track['name'] for track in spotify.artist_top_tracks(artist_id)['tracks']]
    limit=50
    playlists = spotify.search(q='playlist:' + input_name, type='playlist', limit=limit)['playlists']['items']
    _ratings = []
    _users = len(selected_tracks)*[tf.constant('0')]
    __tracks = [track for track in selected_tracks]
    _tracks = [tf.constant(track) for track in __tracks]
    _user = 1
    for playlist in playlists:
      if not playlist['collaborative']:
        id = playlist['id']
        user = playlist['owner']['id']
        tracklist = spotify.playlist_tracks(id)['items']
        for track in tracklist:
          try:

            if track['track']['artists'][0]['id'] == artist_id:
              _users.append(tf.constant(str(_user))),
              _tracks.append(tf.constant(track['track']['name']))
              __tracks.append(track['track']['name'])
          except:
            pass
        _user += 1
    dataset = tf.data.Dataset.from_tensor_slices({'user_id':_users,'movie_title':_tracks})
    mdataset = tf.data.Dataset.from_tensor_slices({'movie_title':list(set(__tracks))})


    ratings = dataset.map(lambda x: {
    "movie_title": x["movie_title"],
    "user_id": x["user_id"]
    })

    movies = mdataset.map(lambda x: x["movie_title"])
    
    return ratings, movies

def create_model(ratings, movies, selected_tracks):
    user_ids_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    user_ids_vocabulary.adapt(ratings.map(lambda x: x["user_id"]))

    movie_titles_vocabulary = tf.keras.layers.StringLookup(mask_token=None)
    movie_titles_vocabulary.adapt(movies)

    # Define user and movie models.
    user_model = tf.keras.Sequential([
        user_ids_vocabulary,
        tf.keras.layers.Embedding(user_ids_vocabulary.vocabulary_size(), 64)
    ])
    movie_model = tf.keras.Sequential([
        movie_titles_vocabulary,
        tf.keras.layers.Embedding(movie_titles_vocabulary.vocabulary_size(), 64)
    ])

    # Define your objectives.
    task = tfrs.tasks.Retrieval(metrics=tfrs.metrics.FactorizedTopK(
        movies.batch(128).map(movie_model)
      )
    )

    # Create a retrieval model.
    model = MovieLensModel(user_model, movie_model, task)
    model.compile(optimizer=tf.keras.optimizers.Adagrad(0.5))

    # Train for 3 epochs.
    model.fit(ratings.batch(4096), epochs=3)

    # Use brute-force search to set up retrieval using the trained representations.
    index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
    index.index_from_dataset(
        movies.batch(100).map(lambda title: (title, model.movie_model(title))))

    # Get some recommendations.
    _, titles = index(np.array(["0"]))
    res = titles[0, :3].numpy()
    lst = selected_tracks
    lst = list(map(lambda x: bytes(x,'utf-8'), lst))
    # lst = [bytes(i, 'utf-8') for i in lst]
    filtered_titles = [r for r in res if r not in lst]



    return(f"Top 3 recommendations for you: {filtered_titles}")



