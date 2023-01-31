import os
import json

import spotipy

import pandas as pd 
import plotly
import plotly.express as px
import plotly.graph_objects as go

from tqdm import tqdm
from alive_progress import alive_bar

from spotipy.oauth2 import SpotifyClientCredentials


import credentials

top_tracks = []
full_log = []

spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())

def run_script(input_name):
    artist_results = spotify.search(q='artist:' + input_name, type='artist')
    artist_id = artist_results['artists']['items'][0]['id']
    artist_name = artist_results['artists']['items'][0]['name']
    albums_results = spotify.artist_albums(artist_id, album_type='album')
    albums = albums_results['items']
    global top_tracks
    top_tracks = [
        track['name'] for track in spotify.artist_top_tracks(artist_id)['tracks']
        ]

    albums_dict = {}
    for i, album in enumerate(albums.__reversed__()):
        if album['name'] not in albums_dict.keys():
            albums_dict[album['name']] = album['uri']

    tracks_dict = {}
    global progress
    progress = 0

    for i, key in enumerate(tqdm(albums_dict.keys())):
        for track in tqdm(spotify.album_tracks(albums_dict[key])['items'], position=1, leave=False):
            id = track['id']
            tracks_dict[id] = {}
            tracks_dict[id]['name'] = track['name']
            tracks_dict[id]['album'] = key
            track_features = spotify.audio_features(tracks=id)[0]
            parameters = track_features.keys()
            for parameter in parameters:
                tracks_dict[id][parameter] = track_features[parameter]
        progress = (i+1)/len(albums_dict) * 100 # update progress


    df = pd.DataFrame.from_dict(tracks_dict, orient='index')
    data0 = df.to_json(orient='columns')
    fig = px.scatter(df, title=artist_name, x="tempo", y="danceability", animation_frame="album", animation_group="valence",
           size="energy", color="valence", hover_name="name",
           log_x=False, size_max=55, range_x=[0,200], range_y=[0,1], color_continuous_scale='reds'
          )
    # fig.update_layout(template='plotly_dark')
    data = json.dumps(tracks_dict)
    arr = df[['tempo','danceability']].to_numpy()
    # x = df['tempo'].values
    df = pd.DataFrame(arr, columns=('x','y'))
    data = df.to_json(orient='columns')



    # graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    with open("sample.json", "w") as outfile:
        json.dump(graphJSON, outfile)

    print(str(graphJSON)[:1000])
    # return graphJSON
    return graphJSON