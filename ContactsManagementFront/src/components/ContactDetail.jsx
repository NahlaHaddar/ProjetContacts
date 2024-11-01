import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getContact, updatePhoto, updateContact } from "../api/ContactService";

const ContactDetail = () => {
  const [contact, setContact] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "",
    photoUrl: "",
  });

  const { id } = useParams();
  console.log(id);

  const fetchContact = async (id) => {
    console.log(id);
    try {
      const { data: contact } = await getContact(id);

      setContact(contact);
      console.log(`***${contact.photoUrl}`);

      console.log(contact);
    } catch (error) {
      console.log(`${error}`);
    }
  };

  useEffect(() => {
    fetchContact(id);
  }, []);

  const selectImage = (event) => inputRef.current.click();

  const onUpdateContact = async () => {
    const { data } = await updateContact(contact);
    setContact(data);
  };

  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
    console.log(event.target.value);
  };

  const inputRef = useRef();

  const udpatePhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("id", id);
    await updatePhoto(formData);
    setContact((contact) => ({
      ...contact,
      photoUrl: `${contact.photoUrl}?updated_at=${new Date().getTime()}`,
    }));
  };
  return (
    <>
      <Link to={"/contacts"} className="link">
        <i className="bi bi-arrow-left"></i> Back to list
      </Link>

      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl}
            alt={`Profile photo of ${contact.name}`}
          />
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">JPG, GIF, or PNG. Max size of 10MG</p>
            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>
        <div className="profile__settings">
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <input
                  type="hidden"
                  defaultValue={contact.id}
                  name="id"
                  required
                />
                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Phone</span>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Status</span>
                  <input
                    type="text"
                    value={contact.status}
                    onChange={onChange}
                    name="status"
                    required
                  />
                </div>
              </div>
              <div className="form_footer">
                <button
                  type="submit"
                  className="btn"
                  onSubmit={onUpdateContact}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <form style={{ display: "none" }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(event) => udpatePhoto(event.target.files[0])}
          name="file"
          accept="image/*"
        />
      </form>
    </>
  );
};

export default ContactDetail;
