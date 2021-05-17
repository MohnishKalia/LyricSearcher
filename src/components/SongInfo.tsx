import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, CardActions, Button, Card } from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'react-moment';
import Grid from '@material-ui/core/Grid'

type TParams = { id: string }

export interface LyricsRes {
    message: LyricsMessage;
}

export interface LyricsMessage {
    header: Header;
    body: LyricsBody;
}

export interface LyricsBody {
    lyrics: Lyrics;
}
export interface TrackRes {
    message: TrackMessage;
}

export interface TrackMessage {
    header: Header;
    body: TrackBody;
}

export interface TrackBody {
    track: Track;
}

export interface Lyrics {
    lyrics_id: number;
    restricted: number;
    instrumental: number;
    lyrics_body: string;
    lyrics_language: string;
    script_tracking_url: string;
    pixel_tracking_url: string;
    lyrics_copyright: string;
    backlink_url: string;
    updated_time: string;
}

export interface Header {
    status_code: number;
    execute_time: number;
}

export interface Track {
    album_id: number;
    album_name: string;
    artist_id: number;
    artist_name: string;
    commontrack_id: number;
    explicit: number;
    has_lyrics: number;
    has_richsync: number;
    has_subtitles: number;
    instrumental: number;
    num_favourite: number;
    primary_genres: { music_genre_list: { music_genre: Genre }[] };
    restricted: number;
    track_edit_url: string;
    track_id: number;
    track_name: string;
    track_name_translation_list: any[];
    track_rating: number;
    track_share_url: string;
    updated_time: string;
}

export interface Genre {
    music_genre_id: number;
    music_genre_parent_id: number;
    music_genre_name: string;
    music_genre_name_extended: string;
    music_genre_vanity: string;
}

const useStyles = makeStyles(theme => ({
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


const SongInfo = ({ match }: RouteComponentProps<TParams>) => {
    const [track, setTrack] = useState({} as Track);
    const [lyrics, setLyrics] = useState({} as Lyrics);
    const classes = useStyles();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_PROXY_URL}/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${match.params.id}&apikey=${process.env.REACT_APP_API_KEY}`)
            .then(res => (res.json() as Promise<LyricsRes>))
            .then(json => { console.log('lyric', json); return json; })
            .then(json => {
                setLyrics(json.message.body.lyrics);
                return fetch(`${process.env.REACT_APP_PROXY_URL}/http://api.musixmatch.com/ws/1.1/track.get?track_id=${match.params.id}&apikey=${process.env.REACT_APP_API_KEY}`);
            })
            .then(res => (res.json() as Promise<TrackRes>))
            .then(json => { console.log('track', json); return json; })
            .then(json => setTrack(json.message.body.track))
            .catch(err => console.log(err));
    }, [match.params.id]);
    if (
        track === undefined ||
        lyrics === undefined ||
        Object.keys(track).length === 0 ||
        Object.keys(lyrics).length === 0
    ) {
        return <div className={classes.formControl} style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress color="secondary" /></div>;
    }
    return (
        <Grid container spacing={5}>
            <Grid item md={9}>
                <Card className={classes.formControl}>
                    <CardActions>
                        <Button size="small" color="primary">
                            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                                Go Back
                        </Link>
                        </Button>
                    </CardActions>
                    <Divider />
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {track.track_name} by {track.artist_name}
                        </Typography>
                        <Typography variant="body2" component="p" style={{ whiteSpace: 'pre-line' }}>
                            {lyrics.lyrics_body}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item md={3}>
                <List dense={true}>
                    <ListItem>
                        <ListItemText
                            primary={track.album_id}
                            secondary="Album ID"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={`${track.track_rating}/100`}
                            secondary="Popularity"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={track.primary_genres.music_genre_list.length === 0
                                ? "NO GENRE AVAILABLE"
                                : track.primary_genres.music_genre_list.map(gen => gen.music_genre.music_genre_name).join(', ')}
                            secondary="Song Genre(s)"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={track.explicit === 0 ? "No" : "Yes"}
                            secondary="Explicit Words"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={<Moment format="MM/DD/YYYY">{track.updated_time}</Moment>}
                            secondary="Release Date"
                        />
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    )
}

export default SongInfo;
