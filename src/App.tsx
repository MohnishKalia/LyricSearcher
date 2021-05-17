import React, { useMemo } from 'react';

import './App.css';
import 'typeface-roboto';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer'
import SongInfo from './components/SongInfo';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        {process.env.REACT_APP_API_KEY
          ?
          <Container fixed>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/info/track/:id" component={SongInfo} />
            </Switch>
          </Container>
          :
          <Box my={2}>
            <Typography variant="body1" color="inherit" align="center">No Musixmatch API Key found</Typography>
          </Box>
        }
        <Footer title="LyricSearcher" description="Made with ⚛ React, Ⓜ Material-UI, and ♡ Love!" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
