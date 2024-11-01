import { useState, useEffect, useRef } from "react";
import { getContacts, saveContact, updatePhoto } from "./api/ContactService";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";

function App() {
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);

  const fileRef = useRef(undefined);
  const formRef = useRef();

  const handleNewContact = async (event) => {
    event.preventDefault();

    let formData = new FormData(formRef.current);

    const { data } = await saveContact({
      name: formData.get("name"),
      address: formData.get("address"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: formData.get("status"),
    });
    console.log(data);

    formData.append("id", data.id);
    console.log(formData.get("id"));
    formData.append("file", file, file.name);
    console.log(formData.get("file"));
    try {
      const photoUrl = await updatePhoto(formData);
      console.log(photoUrl);
    } catch (error) {
      console.log(`${error}`);
    }

    setFile(undefined);
    formRef.current.reset();
    formData = new FormData(formRef.current);
    toggleModal(false);

    getAllContacts();
  };

  const getAllContacts = async (page = 0, size = 3) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      fileRef.current.value = null;
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  const modalRef = useRef(null);
  const toggleModal = (show) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  return (
    <>
      <Header
        toggleModal={toggleModal}
        nbOfContacts={data.totalElements}
      ></Header>
      <main className="main">
        <div className="container">
          <Routes>
            <Route path={"/"} element={<Navigate to={"/contacts"} />}></Route>
            <Route
              path={"/contacts"}
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            ></Route>
            <Route path={"/contacts/:id"} element={<ContactDetail />}></Route>
          </Routes>
        </div>
      </main>
      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form ref={formRef} onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="email" name="email" required />
              </div>

              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  name="phone"
                  maxLength={8}
                  minLength={8}
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" name="status" required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  ref={fileRef}
                  type="file"
                  name="photo"
                  onChange={(event) => setFile(event.target.files[0])}
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                type="button"
                onClick={() => toggleModal(false)}
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
