import React, { Component } from "react";
import InventoryDataService from "../services/inventory.service";

import { styles } from "../css-common"
import { TextField, Button, withStyles } from "@material-ui/core";

class Inventory extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeInventoryType = this.onChangeInventoryType.bind(this);
        this.getInventory = this.getInventory.bind(this);
        this.updatePublished = this.updatePublished.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.deleteInventory = this.deleteInventory.bind(this);

        this.state = {
            currentInventory: {
                id: null,
                name: "",
                inventoryType: "",
                published: false
            },
            message: ""
        };
    }

    componentDidMount() {
        this.getInventory(this.props.match.params.id);
    }

    onChangeName(e) {
        const name = e.target.value;

        this.setState(function (prevState) {
            return {
                currentInventory: {
                    ...prevState.currentInventory,
                    name: name
                }
            };
        });
    }

    onChangeInventoryType(e) {
        const inventoryType = e.target.value;

        this.setState(prevState => ({
            currentInventory: {
                ...prevState.currentInventory,
                inventoryType: inventoryType
            }
        }));
    }

    getInventory(id) {
        InventoryDataService.get(id)
            .then(response => {
                this.setState({
                    currentInventory: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updatePublished(status) {
        var data = {
            id: this.state.currentInventory.id,
            name: this.state.currentInventory.name,
            inventoryType: this.state.currentInventory.inventoryType,
            published: status
        };

        InventoryDataService.update(this.state.currentInventory.id, data)
            .then(response => {
                this.setState(prevState => ({
                    currentInventory: {
                        ...prevState.currentInventory,
                        published: status
                    }
                }));
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateInventory() {
        InventoryDataService.update(
            this.state.currentInventory.id,
            this.state.currentInventory
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The Inventory was updated successfully!"
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    deleteInventory() {
        InventoryDataService.delete(this.state.currentInventory.id)
            .then(response => {
                console.log(response.data);
                this.props.history.push('/inventory')
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { currentInventory } = this.state;
        const { classes } = this.props

        return (
            <div>
                {currentInventory ? (
                    <div className={classes.form}>
                        <h2>Inventory</h2>
                        <form>
                            <div>
                                <TextField
                                    className={classes.textField}
                                    label="Name"
                                    name="name"
                                    value={currentInventory.name}
                                    onChange={this.onChangeName}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    className={classes.textField}
                                    label="InventoryType"
                                    name="inventoryType"
                                    value={currentInventory.inventoryType}
                                    onChange={this.onChangeInventoryType}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <strong>Status: </strong>
                                </label>
                                {currentInventory.published ? "Published" : "Pending"}
                            </div>
                        </form>
                        <div className={classes.buttonWrapper}>
                            {currentInventory.published ? (
                                <Button
                                    className={`${classes.publish} ${classes.button}`}
                                    onClick={() => this.updatePublished(false)}
                                >
                                    UnPublish
              </Button>
                            ) : (
                                    <Button
                                        className={`${classes.publish} ${classes.button}`}
                                        onClick={() => this.updatePublished(true)}
                                    >
                                        Publish
              </Button>
                                )}
                            <Button
                                className={`${classes.delete} ${classes.button}`}
                                onClick={this.deleteInventory}
                            >
                                Delete
            </Button>

                            <Button
                                type="submit"
                                className={`${classes.update} ${classes.button}`}
                                onClick={this.updateInventory}
                            >
                                Update
            </Button>
                        </div>
                        <p>{this.state.message}</p>
                    </div>
                ) : (
                        <div>
                            <br />
                            <p>Please click on a Inventory...</p>
                        </div>
                    )}
            </div>
        );
    }
}

export default withStyles(styles)(Inventory)