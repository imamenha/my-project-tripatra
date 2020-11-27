import React, { Component } from "react";
import InventoryDataService from "../services/inventory.service";
import { Link } from "react-router-dom";

import { styles } from "../css-common"
import { TextField, Button, Grid, ListItem, withStyles } from "@material-ui/core";

class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveInventories = this.retrieveInventories.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveInventory = this.setActiveInventory.bind(this);
    this.removeAllInventories = this.removeAllInventories.bind(this);
    this.searchName = this.searchName.bind(this);

    this.state = {
      inventories: [],
      currentInventory: null,
      currentIndex: -1,
      searchName: ""
    };
  }

  componentDidMount() {
    this.retrieveInventories();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  retrieveInventories() {
    InventoryDataService.getAll()
      .then(response => {
        this.setState({
          Inventories: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveInventories();
    this.setState({
      currentInventory: null,
      currentIndex: -1
    });
  }

  setActiveInventory(inventory, index) {
    this.setState({
      currentInventory: inventory,
      currentIndex: index
    });
  }

  removeAllInventories() {
    InventoryDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchName() {
    InventoryDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          inventories: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props
    const { searchName, inventories, currentInventory, currentIndex } = this.state;

    return (
      <div className={classes.form}>
        <Grid container>
          <Grid className={classes.search} item sm={12} xs={12} md={12} xl={12} lg={12}>
            <TextField
              label="Search by title"
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <Button
              size="small"
              variant="outlined"
              className={classes.textField}
              onClick={this.searchName}>
              Search
            </Button>
          </Grid>
          <Grid item md={4}>
            <h2>Inventories List</h2>

            <div className="list-group">
              {inventories &&
                inventories.map((inventory, index) => (
                  <ListItem
                    selected={index === currentIndex}
                    onClick={() => this.setActiveInventory(inventory, index)}
                    divider
                    button	
                    key={index}>
                    {inventory.title}
                  </ListItem>
                ))}
            </div>

            <Button
              className={`${classes.button} ${classes.removeAll}`}
              size="small"
              color="secondary"
              variant="contained"
              onClick={this.removeAllInventories}
            >
              Remove All
          </Button>
          </Grid>
          <Grid item md={8}>
            {currentInventory ? (
              <div className={classes.inventory}>
                <h4>Inventory</h4>
                <div className={classes.detail}>
                  <label>
                    <strong>Title:</strong>
                  </label>{" "}
                  {currentInventory.title}
                </div>
                <div className={classes.detail}>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {currentInventory.description}
                </div>
                <div className={classes.detail}>
                  <label>
                    <strong>Status:</strong>
                  </label>{" "}
                  {currentInventory.published ? "Published" : "Pending"}
                </div>

                <Link
                  to={"/inventory/" + currentInventory.id}
                  className={classes.edit}
                >
                  Edit
              </Link>
              </div>
            ) : (
                <div>
                  <br />
                  <p className={classes.inventory}>Please click on a Inventory...</p>
                </div>
              )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(InventoryList)