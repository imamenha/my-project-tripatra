import React, { Component } from "react";
import InventoryDataService from "../services/inventory.service";

import { TextField, Button, withStyles } from "@material-ui/core"
import { styles } from "../css-common"

class AddInventory extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeInventoryType = this.onChangeInventoryType.bind(this);
        this.saveInventory = this.saveInventory.bind(this);
        this.newInventory = this.newInventory.bind(this);

        this.state = {
            id: null,
            name: "",
            inventoryType: "",
            published: false,

            submitted: false
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeInventoryType(e) {
        this.setState({
            inventoryType: e.target.value
        });
    }

    saveInventory() {
        var data = {
            id: this.state.id,
            name: this.state.name,
            inventoryType: this.state.inventoryType
        };

        InventoryDataService.create(data)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    inventoryType: response.data.inventoryType,
                    published: response.data.published,

                    submitted: true
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    newInventory() {
        this.setState({
            id: null,
            name: "",
            inventoryType: "",
            published: false,

            submitted: false
        });
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                {this.state.submitted ? (
                    <div className={classes.form}>
                        <h4>You submitted successfully!</h4>
                        <Button
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={this.newInventory}>
                            Add
                        </Button>
                    </div>
                ) : (
                        <div className={classes.form}>
                            <div className={classes.textField}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.onChangeName}
                                    required
                                />
                            </div>

                            <div className={classes.textField}>
                                <TextField
                                    label="Inventory Type"
                                    name="inventoryType"
                                    value={this.state.inventoryType}
                                    onChange={this.onChangeInventoryType}
                                    required
                                />
                            </div>

                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={this.saveInventory}>
                                Submit
                            </Button>
                        </div>
                    )}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(AddInventory)