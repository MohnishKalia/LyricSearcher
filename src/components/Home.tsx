import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField'
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Album from '@material-ui/icons/Album';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useDebounce } from 'use-lodash-debounce'
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box';


const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
    },
    formControl: {
        marginTop: theme.spacing(2)
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export interface SearchRes {
    message: Message;
}

export interface Message {
    header: Header;
    body: Body;
}

export interface Body {
    track_list: Track[];
}

export interface Header {
    status_code: number;
    execute_time: number;
    available: number;
}

export interface Track {
    track: LyricData
}

export interface LyricData {
    track_id: number;
    track_name: string;
    commontrack_id: number;
    instrumental: number;
    has_lyrics: number;
    has_subtitles: number;
    album_name: string;
    artist_id: number;
    artist_name: string;
    track_share_url: string;
    track_edit_url: string;
    restricted: number;
    updated_time: string;
}

const Home: React.FC = () => {
    const [query, setQuery] = useState('');
    const [amount, setAmount] = useState('15');
    const [songs, setSongs] = useState<Track[]>([]);
    const dbQuery = useDebounce(query, 1500)

    const classes = useStyles();
    const values = [6, 9, 15, 21]

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_PROXY_URL}/http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${dbQuery}&page_size=${amount}&page=1&s_track_rating=desc&apikey=${process.env.REACT_APP_API_KEY}`)
            .then(res => (res.json() as Promise<SearchRes>))
            .then(json => setSongs(json.message.body.track_list))
    }, [dbQuery, amount]);

    return (
        <>
            <TextField
                className={classes.formControl}
                label="What song lyrics are you wondering about today?"
                value={query}
                onChange={e => setQuery(e.target.value as string)}
                size="medium"
                fullWidth
                variant="outlined"
            />
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Amount</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={amount}
                    onChange={e => setAmount(e.target.value as string)}
                >
                    {values.map(val => <MenuItem value={val} key={val}>{val}</MenuItem>)}
                </Select>
            </FormControl>
            <Box mt={2}>
                {songs.length > 0
                    ?
                    <Grid container spacing={3}>
                        {songs.map(song => <SongItem song={song} key={song.track.track_id} />)}
                    </Grid>
                    : <div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress color="secondary" /></div>}
            </Box>
        </>
    );

}

export const SongItem: React.FC<{ song: Track }> = ({ song }) =>
    <Grid item md={4} zeroMinWidth>
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" noWrap={true}>
                    {song.track.artist_name}
                </Typography>
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <PlayCircleFilled />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant="body2" component="p" noWrap={true}>{song.track.track_name}</Typography>}
                            disableTypography={true}
                            secondary={<Typography variant="body2" color="textSecondary" component="p" noWrap={true}>{"Track"}</Typography>}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Album />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography variant="body2" component="p" noWrap={true}>{song.track.album_name}</Typography>}
                            disableTypography={true}
                            secondary={<Typography variant="body2" color="textSecondary" component="p" noWrap={true}>{"Album"}</Typography>}
                        />
                    </ListItem>
                </List>
            </CardContent>
            <Divider />
            <CardActions>
                <Button size="small" color="primary">
                    <Link
                        to={`info/track/${song.track.track_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        View Lyrics &amp; More
                    </Link>
                </Button>
            </CardActions>
        </Card>
    </Grid>

export default Home;

