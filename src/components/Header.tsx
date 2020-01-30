import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MusicNote from '@material-ui/icons/MusicNote';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    appBar: {
        alignItems: 'center'
    },
    title: {
        flexGrow: 1,
    },
}));


const Header: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="sticky" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MusicNote />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        LyricSearcher
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;