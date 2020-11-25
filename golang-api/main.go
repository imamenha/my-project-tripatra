package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type InventoryType struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

var InventoryTypes []InventoryType

type Inventory struct {
	Id            string `json:"id"`
	Name          string `json:"name"`
	InventoryType int    `json:"inventoryType"`
}

var Inventories []Inventory

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the homepage!")
	fmt.Println("Endpoint hit : homepage")
}

func returnAllInventories(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: returnAllInventories")
	json.NewEncoder(w).Encode(Inventories)
}

func returnAllInventoryTypes(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: returnAllInventoryTypes")
	json.NewEncoder(w).Encode(InventoryTypes)
}

func inventoryById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	fmt.Println("Key: " + key)

	for _, inventory := range Inventories {
		if inventory.Id == key {
			json.NewEncoder(w).Encode(inventory)
		}
	}
}

func createOrUpdateInventory(w http.ResponseWriter, r *http.Request) {
	// get the body of our POST request
	// return the string response containing the request body
	reqBody, _ := ioutil.ReadAll(r.Body)
	fmt.Println(string(reqBody))

	var inventory Inventory
	json.Unmarshal(reqBody, &inventory)
	// update our global inventory array to include
	// our new inventory
	for i, inv := range Inventories {
		if inv.Id == inventory.Id {
			Inventories = append(Inventories[:i], Inventories[i+1:]...)
		}
	}
	Inventories = append(Inventories, inventory)

	json.NewEncoder(w).Encode(inventory)
}

func deleteInventory(w http.ResponseWriter, r *http.Request) {
	// once again, we will need to parse the path parameters
	vars := mux.Vars(r)
	// we will need to extract the `id` of the inventory we
	// wish to delete
	id := vars["id"]

	// we then need to loop through all our inventories
	for index, inventory := range Inventories {
		// if our id path parameter matches one of our
		// inventories
		if inventory.Id == id {
			// updates our inventories array to remove the
			// inventory
			Inventories = append(Inventories[:index], Inventories[index+1:]...)
		}
	}

}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.HandleFunc("/", homePage)

	myRouter.HandleFunc("/inventoryTypes", returnAllInventoryTypes)
	myRouter.HandleFunc("/inventories", returnAllInventories)

	myRouter.HandleFunc("/inventory/{id}", inventoryById)

	myRouter.HandleFunc("/inventory", createOrUpdateInventory).Methods("POST")
	myRouter.HandleFunc("/inventory", createOrUpdateInventory).Methods("PUT")

	myRouter.HandleFunc("/inventory/{id}", deleteInventory).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
	InventoryTypes = []InventoryType{
		InventoryType{Id: 1, Name: "RAW"},
		InventoryType{Id: 2, Name: "Semi finished Goods"},
		InventoryType{Id: 3, Name: "Finished Goods"},
	}
	Inventories = []Inventory{
		Inventory{Id: "A0001", Name: "Wood", InventoryType: 1},
		Inventory{Id: "A0002", Name: "Plywood", InventoryType: 2},
	}
	handleRequests()
}
