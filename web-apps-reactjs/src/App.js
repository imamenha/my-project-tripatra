import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import { styles } from "./css-common"

import AddInventory from "./components/addInventory.component";
import Inventories from "./components/inventories.component";
import inventoryList from "./components/inventoryList.component";

import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';

class App extends Component {
  render() {
    const { classes } = this.props

    return (
      <div>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography className={classes.name} variant="h6">
              Inventory Material
            </Typography>
            <Link to={"/inventories"} className={classes.link}>
              <Typography variant="body2">
                Inventories
              </Typography>
            </Link>
            <Link to={"/inventory"} className={classes.link}>
              <Typography variant="body2">
                Add
            </Typography>
            </Link>
          </Toolbar>
        </AppBar>

          <Switch>
            <Route exact path={["/", "/inventories"]} component={inventoryList} />
            <Route exact path="/inventory" component={AddInventory} />
            <Route path="/inventory/:id" component={Inventories} />
          </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(App);