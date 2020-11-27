import http from "../http-common";

class InventoryDataService {
  getAll() {
    return http.get("/inventories");
  }

  get(id) {
    return http.get(`/inventory/${id}`);
  }

  create(data) {
    return http.post("/inventory", data);
  }

  update(data) {
    return http.put(`/inventory/`, data);
  }

  delete(id) {
    return http.delete(`/inventory/${id}`);
  }

  deleteAll() {
    return http.delete(`/inventory`);
  }

  findByName(name) {
    return http.get(`/inventoryByKeyword/${name}`);
  }
}

export default new InventoryDataService();