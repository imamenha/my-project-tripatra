package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gopkg.in/gomail.v2"
)

const CONFIG_SMTP_HOST = "smtp.gmail.com"
const CONFIG_SMTP_PORT = 587
const CONFIG_SENDER_NAME = "System Auto Send <systemimam@gmail.com>"
const CONFIG_AUTH_EMAIL = "systemimam@gmail.com"
const CONFIG_AUTH_PASSWORD = "Sy5t3mIm4m"

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
	enableCors(&w)

	fmt.Println("Endpoint Hit: returnAllInventories")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Inventories)
}

func returnAllInventoryTypes(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	fmt.Println("Endpoint Hit: returnAllInventoryTypes")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(InventoryTypes)
}

func inventoryById(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	vars := mux.Vars(r)
	key := vars["id"]

	fmt.Println("Key: " + key)

	w.Header().Set("Content-Type", "application/json")
	for _, inventory := range Inventories {
		if inventory.Id == key {
			json.NewEncoder(w).Encode(inventory)
		}
	}
}

func inventoryByKeyword(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	vars := mux.Vars(r)
	key := vars["keyword"]

	fmt.Println("Key: " + key)

	w.Header().Set("Content-Type", "application/json")

	var SearchResult []Inventory
	for _, inventory := range Inventories {
		fmt.Println("Key: " + key + " Name: " + inventory.Name)
		if strings.Contains(strings.ToLower(inventory.Name), strings.ToLower(key)) {
			SearchResult = append(SearchResult, inventory)
		}
	}
	json.NewEncoder(w).Encode(SearchResult)
}

func createOrUpdateInventory(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	// get the body of our POST request
	// return the string response containing the request body
	reqBody, _ := ioutil.ReadAll(r.Body)
	fmt.Println(string(reqBody))

	var inventory Inventory
	json.Unmarshal(reqBody, &inventory)
	// update our global inventory array to include
	// our new inventory
	var isUpdate bool = false
	for i, inv := range Inventories {
		if inv.Id == inventory.Id {
			Inventories = append(Inventories[:i], Inventories[i+1:]...)
			isUpdate = true
		}
	}
	Inventories = append(Inventories, inventory)
	if !isUpdate {
		sendEmail(inventory)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(inventory)
}

func deleteInventory(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	// once again, we will need to parse the path parameters
	vars := mux.Vars(r)
	// we will need to extract the `id` of the inventory we
	// wish to delete
	id := vars["id"]

	// we then need to loop through all our inventories
	if id != "" {
		for index, inventory := range Inventories {
			// if our id path parameter matches one of our
			// inventories
			if inventory.Id == id {
				// updates our inventories array to remove the
				// inventory
				Inventories = append(Inventories[:index], Inventories[index+1:]...)
			}
		}
	} else {
		Inventories = []Inventory{}
	}

}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.HandleFunc("/", homePage)

	myRouter.HandleFunc("/inventoryTypes", returnAllInventoryTypes)
	myRouter.HandleFunc("/inventories", returnAllInventories)

	myRouter.HandleFunc("/inventory/{id}", inventoryById)
	myRouter.HandleFunc("/inventoryByKeyword/{keyword}", inventoryByKeyword)

	myRouter.HandleFunc("/inventory", createOrUpdateInventory).Methods("POST")
	myRouter.HandleFunc("/inventory", createOrUpdateInventory).Methods("PUT")

	myRouter.HandleFunc("/inventory", deleteInventory).Methods("DELETE")
	myRouter.HandleFunc("/inventory/{id}", deleteInventory).Methods("DELETE")

	corsObj := handlers.AllowedOrigins([]string{"*"})
	log.Fatal(http.ListenAndServe(":10000", handlers.CORS(corsObj)(myRouter)))
}

func sendEmail(obj Inventory) {
	mailer := gomail.NewMessage()
	mailer.SetHeader("From", CONFIG_SENDER_NAME)
	mailer.SetHeader("To", "i.nurhadianto@gmail.com")
	mailer.SetAddressHeader("Cc", "imamnurhadianto@gmail.com", "Imam Nurhadianto")
	mailer.SetHeader("Subject", "Receive New Material")
	mailer.SetBody("text/html", "Hello <b>Warehouse Officer</b>, <br><br>New Material added with details : <br>ID : <b>"+obj.Id+"</b><br>Name : <b>"+obj.Name+"</b><br>Inventory Type : <b>"+getNameInvType(obj.InventoryType)+"</b>")
	// mailer.Attach("./sample.png")

	dialer := gomail.NewDialer(
		CONFIG_SMTP_HOST,
		CONFIG_SMTP_PORT,
		CONFIG_AUTH_EMAIL,
		CONFIG_AUTH_PASSWORD,
	)

	err := dialer.DialAndSend(mailer)
	if err != nil {
		log.Fatal(err.Error())
	}

	log.Println("Mail sent!")
}

func getNameInvType(invType int) string {
	var name string
	for _, inventoryType := range InventoryTypes {
		if inventoryType.Id == invType {
			name = inventoryType.Name
			break
		}
	}
	return name
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
