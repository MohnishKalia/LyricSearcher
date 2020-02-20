import React from 'react';
import './App.css';
import 'typeface-roboto';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home';
import Footer from './components/Footer'
import SongInfo from './components/SongInfo';
import Container from '@material-ui/core/Container'

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Container fixed>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/info/track/:id" component={SongInfo} />
        </Switch>
      </Container>
      <Footer title="LyricSearcher" description="Made with ⚛ React and Ⓜ Material-UI with Love!" />
    </Router>
  );
}

export default App;
