import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png"
import { Modal } from 'react-bootstrap';
import { Editor } from 'primereact/editor';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const fetchBlogdetails = async (id) => {
        setLoader(true);
        try {
            const res = await Axios.get(apiendpoints.viewBlog.replace(":id", id), authorizationHeaders());

            if (res.data?.status) {
                setFormData(res.data.data);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                toast.error(err.message);
            }
            if (err.response?.status === 404) {
                toast.error(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        fetchBlogdetails(id);
    }, [id]);
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="edit-user">
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <h2 className="d-flex mb-0 title">
                                <div className='pe-4' style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                                    <img src={left} alt="" style={{ height: '30px' }} />
                                </div>
                                <div>
                                    Blog Detail
                                </div>
                            </h2>
                        </div>

                        {/* ✅ Show loader while fetching */}
                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form className="row g-3">
                                <div className="col-lg-6 col-md-6 col-12 mb-2 d-flex flex-column">
                                    <label htmlFor="donatorphoto" className="form-label">
                                        Photo :
                                    </label>
                                    <button type='button' className='submit-btn ' style={{ width: '100%', maxWidth: '157px' }} onClick={handleOpen}>View</button>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="title" className="form-label">
                                        Title :
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        autoComplete='off'
                                        value={formData.title}
                                        readOnly
                                    />
                                </div>

                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">
                                        Description  :
                                    </label>
                                    <Editor value={formData.description}
                                        onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue })} style={{ height: '320px' }}  readOnly/>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img
                        src={formData.image}
                        alt="Preview"
                        className="img-fluid"
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default BlogDetails
