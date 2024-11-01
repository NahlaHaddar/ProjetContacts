import axios from "axios";

const appUrl = "http://localhost:8090/contacts";

export async function saveContact(contact) {
  console.log(contact.name);
  return await axios.post(`${appUrl}`, contact);
}

export async function getContacts(page = 0, size = 10) {
  return await axios.get(`${appUrl}?page=${page}&size=${size}`);
}

export async function getContact(id) {
  return await axios.get(`${appUrl}/one/${id}`);
}

export async function updateContact(contact) {
  return await axios.post(`${appUrl}`, contact);
}

export async function updatePhoto(formData) {
  console.log(formData.get("id"));
  return await axios.put(`${appUrl}/photo`, formData);
}

export async function deleteContact(id) {
  return await axios.delete(`${appUrl}?id=${id}`);
}
