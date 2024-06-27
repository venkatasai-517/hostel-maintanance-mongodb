// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import "./Nav";

import axios from "axios";
import { logout } from "./helper";

const customStyle = {
  headRow: {
    style: {
      backgroundColor: "black",
      color: "white",
    },
  },
};

function App() {
  const [originalRecords, setOriginalRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [data1, setData1] = useState({
    date: "",
    name: "",
    status: "",
    room_number: "",
    floor_number: "",
    price: "",
    room_img: "",
    due_date: "",
  });
  const [img, setImg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/hostel/threeshares"
      );
      setOriginalRecords(response.data);
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };
  const calculateDueDate = (dateOfJoin) => {
    // Assuming due date is 7 days after the date of join
    const dueDate = new Date(dateOfJoin);
    dueDate.setDate(dueDate.getDate() + 30); // Adjust as needed

    return dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all fields from data1 to FormData
    Object.keys(data1).forEach((key) => {
      formData.append(key, data1[key]);
    });

    // Append the image file if it exists
    if (img) {
      formData.append("room_img", img);
    }

    try {
      let response;
      if (selectedRecord) {
        // Send PUT request to update the existing record
        response = await axios.put(
          `http://localhost:5000/hostel/threeshare/${selectedRecord.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Room updated successfully!");
      } else {
        // Send POST request to create a new record
        // eslint-disable-next-line no-unused-vars
        response = await axios.post(
          "http://localhost:5000/hostel/threeshare",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Room added successfully!");
      }

      // Reset the form fields
      setData1({
        date: "",
        name: "",
        status: "",
        room_number: "",
        floor_number: "",
        price: "",
        room_img: "",
        due_date: "", // Assuming due_date is part of data1
      });
      setImg(null);
      setSelectedRecord(null);
    } catch (err) {
      console.error("Error uploading room data:", err);
      alert("Error uploading room data");
    }
  };

  const submitEditHandler = async () => {
    const id = selectedRecord._id;
    const data = new FormData();

    // Append existing data1 fields to FormData
    for (const key in data1) {
      data.append(key, data1[key]);
    }

    // Append new image only if img is not empty
    if (img) {
      data.append("room_img", img);
    }

    try {
      // Send PUT request to update student record
      await axios.put(`http://localhost:5000/hostel/threeshares/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Room updated successfully");
    } catch (error) {
      console.error("Error updating Room data:", error);
      alert("Error updating Room data");
    }
  };
  const handleDeleteButtonClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hostel/threeshares/${id}`);
      // After deletion, fetch students again to update the list
      fetchRooms();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEditButtonClick = (row) => {
    setSelectedRecord(row);
    setData1(row);
  };

  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === "") {
      setRecords(originalRecords);
    } else {
      const filteredData = originalRecords.filter((row) => {
        // Convert each property to a string and lowercase it for comparison
        const roomNumberLower = String(row.room_number).toLowerCase();
        const statusLower = String(row.status).toLowerCase();
        const floorNumberLower = String(row.floor_number).toLowerCase();
        const priceLower = String(row.price).toLowerCase();
        const dateLower = String(row.date).toLowerCase();
        const dueDateLower = String(row.due_date).toLowerCase();

        // Check if the search term is included in any of the fields
        return (
          roomNumberLower.includes(searchTerm) ||
          statusLower.includes(searchTerm) ||
          floorNumberLower.includes(searchTerm) ||
          priceLower.includes(searchTerm) ||
          dateLower.includes(searchTerm) ||
          dueDateLower.includes(searchTerm)
        );
      });
      setRecords(filteredData);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const columns = [
    {
      name: "DATE OF JOIN",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "DUE DATE",
      selector: (row) => row.due_date,
      sortable: true,
      cell: (row) => {
        // Calculate days difference between current date and due date
        const today = new Date();
        const dueDate = new Date(row.due_date);
        const differenceInDays = Math.floor(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        let badgeClass = "badge bg-success"; // Default badge color for due date

        // Change badge color based on days difference
        if (differenceInDays < 3) {
          badgeClass = "badge bg-danger"; // Red color for near due dates
        }

        return (
          <span className={badgeClass}>
            {row.due_date} {/* Display due date */}
          </span>
        );
      },
    },
    // {
    //   name: "STUDENT_NAME",
    //   selector: (row) => row.name,
    //   sortable: true,
    // },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let badgeClass = "";
        let statusText = "";

        switch (row.status) {
          case "Available":
            badgeClass = "badge bg-success";
            statusText = "Available";
            break;
          case "Not Available":
            badgeClass = "badge bg-danger";
            statusText = "Not Available";
            break;
          case "Under Maintenance":
            badgeClass = "badge bg-warning";
            statusText = "Under Maintenance";
            break;
          default:
            badgeClass = "badge bg-secondary";
            statusText = "Unknown";
        }

        return <span className={badgeClass}>{statusText}</span>;
      },
    },
    {
      name: "ROOM NUMBER",
      selector: (row) => row.room_number,
      sortable: true,
      cell: (row) => {
        let badgeClass = "badge bg-info"; // Default badge color for room numbers

        // Example condition for displaying a badge based on room number
        if (row.room_number === "101") {
          badgeClass = "badge bg-primary";
        }

        return <span className={badgeClass}>{row.room_number}</span>;
      },
    },
    {
      name: "FLOOR",
      selector: (row) => row.floor_number,
      sortable: true,
      cell: (row) => {
        let badgeClass = "badge bg-warning"; // Default badge color for room numbers

        // Example condition for displaying a badge based on room number
        if (row.floor_number === "10") {
          badgeClass = "badge bg-primary";
        }

        return <span className={badgeClass}>{row.floor_number}</span>;
      },
    },
    {
      name: "PRICE",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => {
        let badgeClass = "badge bg-secondary"; // Default badge color for price

        // Example condition for displaying a badge based on price
        if (row.price > 100) {
          badgeClass = "badge bg-success";
        } else if (row.price > 50) {
          badgeClass = "badge bg-warning";
        } else {
          badgeClass = "badge bg-danger";
        }

        return (
          <span className={badgeClass}>
            ${row.price} {/* Format price to two decimal places */}
          </span>
        );
      },
    },
    {
      name: "ROOM IMG",
      selector: (row) => row.room_img,
      sortable: true,
      cell: (row) =>
        row.room_img ? (
          <img
            src={`http://localhost:5000/uploads/${row.room_img}`}
            alt="Profile"
            style={{ width: "50px", height: "50px" }}
          />
        ) : null,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      cell: (row) => (
        <div className="row">
          <div className="col">
            <button
              className="btn badge text-bg-danger "
              onClick={() => handleDeleteButtonClick(row._id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <button
              className="btn badge text-bg-primary ms-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal1"
              onClick={() => handleEditButtonClick(row)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setData1({
        ...data1,
        [name]: value,
        due_date: calculateDueDate(value), // Calculate due date when 'date' changes
      });
    } else {
      setData1({ ...data1, [name]: value });
    }
  };

  return (
    <div className="container mt-3 ">
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid ">
          <a className="navbar-brand  text-white badge text-bg-dark" href="#">
            HOSTEL MANAGMENT
          </a>
          <button
            className="navbar-toggler text-bg-secondary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-4 ms-5">
              <li className="nav-item  text-white">
                <a
                  className="nav-link active  text-white badge "
                  aria-current="page"
                  href="\app"
                >
                  SINGLE SHARE
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active  text-white badge" href="\second">
                  DOUBLE SHARE
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active  text-white badge text-bg-secondary"
                  href="\thrible"
                >
                  THRIBLE SHARE
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active  text-white badge" href="\four">
                  FOUR SHARE
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active  text-white badge"
                  href="\studentdetails"
                >
                  STUDENT DETAILS
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <button
                className="btn badge text-bg-success"
                onClick={handleLogout}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="row justify-content-end p-4">
        <div className="col-auto">
          <button
            type="button"
            className="btn badge text-bg-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add AVAILABLE ROOMS
          </button>
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={handleFilter}
          />
        </div>
      </div>

      <DataTable
        className="table table-bordered table-secondary"
        columns={columns}
        data={records}
        selectableRows
        pagination
        customStyles={customStyle}
      />

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Customer
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitHandler}>
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={data1.date}
                    onChange={changeHandler}
                    required
                  />
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label">Student_name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data1.name}
                    onChange={changeHandler}
                    required
                  />
                </div> */}
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={data1.status}
                    onChange={changeHandler}
                    required
                  >
                    <option value="" disabled>
                      Choose...
                    </option>
                    <option className="badge text-bg-success" value="Available">
                      Available
                    </option>
                    <option
                      className="badge text-bg-danger"
                      value="Not Available"
                    >
                      Not Available
                    </option>
                    <option
                      className="badge text-bg-warning"
                      value="Under Maintenance"
                    >
                      Under Maintenance
                    </option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="room_number"
                    value={data1.room_number}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Floor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="floor_number"
                    value={data1.floor_number}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={data1.price}
                      onChange={changeHandler}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label">Git Colab</label>
                  <input
                    type="text"
                    className="form-control"
                    name="room_img"
                    value={data1.room_img}
                    onChange={changeHandler}
                    required
                  />
                </div> */}
                <div className="col-md-4">
                  <label className="form-label">ROOM Img</label>
                  <input
                    type="file"
                    name="room_img"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit PG Students Record
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitEditHandler}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={data1.date}
                    onChange={changeHandler}
                    required
                  />
                </div>
                {/* <div className="mb-3">
                  <label className="form-label">Student Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data1.name}
                    onChange={changeHandler}
                    required
                  />
                </div> */}
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={data1.status}
                    onChange={changeHandler}
                    required
                  >
                    <option value="" disabled>
                      Choose...
                    </option>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="room_number"
                    value={data1.room_number}
                    onChange={changeHandler}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Floor number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="floor_number"
                    value={data1.floor_number}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={data1.price}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Room Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => setImg(event.target.files[0])}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
