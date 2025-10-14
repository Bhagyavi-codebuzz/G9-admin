import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { authorizationHeaders, authorizationHeadersImage, Axios } from "../../helper/Axios";
import { apiendpoints } from "../../constants/apiroutes";

const AddCSV = ({ show, handleClose, fetchProducts }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Debug
        for (let [key, value] of formData.entries()) {
            
        }




        try {
          setIsUploading(true);

          const res = await Axios.post(
            apiendpoints.addCSV, 
            formData,
            
            authorizationHeadersImage()
            
          );

          if (res.data?.status) {
            toast.success(res.data?.message || "CSV uploaded successfully!");
            fetchProducts(); // reload list
            handleClose();
          } else {
            toast.error(res.data?.message || "Failed to upload CSV");
          }
        } catch (err) {
          console.error("CSV Upload Error:", err);
          toast.error("Something went wrong!");
        } finally {
          setIsUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <div className="modal-header">
                <h5 className="modal-title">Upload CSV</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
                <input
                    type="file"
                    accept=".csv"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>
            <div className="modal-footer">
                <button type="button" className="delete-btn" onClick={handleClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className={`close-btn ${isUploading ? "btn-loading" : ""}`}
                    disabled={isUploading}
                    onClick={handleUpload}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </Modal>
    );
};

export default AddCSV;
