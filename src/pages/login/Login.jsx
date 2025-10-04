import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCog } from 'react-icons/fa';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import login_logo from "../../assets/images/login-logo.svg"
import { loaders } from '../../componet/loader/Loader';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { Axios } from '../../componet/helper/Axios';
import { toast } from 'react-toastify';

const initialState = {
    email: "",
    password: "",
}
const Login = () => {
    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const [showpassword, setshowpassword] = useState(false);

    const PasswordShowHide = () => {
        setshowpassword((prevShowPassword) => !prevShowPassword);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        setLoading(true);

        try {
            const res = await Axios.post(apiendpoints.login, formData);

            if (res.data.status) {
                toast.success(res.data.message);

                setFormData(initialState);
                localStorage.setItem("admin-G9-token", res?.data?.data);
                navigate("/admin/dashboard");
            }
            else {
                toast.error(res.data.message);
            }
        }
        catch (err) {
            if (err?.message === "Network Error") {
                toast.error(err.message);
            }
            if (err.response?.status === 404) {
                toast.error(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                toast.error(err.response.data.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            <section className="login-section">
                <div className="container d-flex align-items-center justify-content-center min-vh-100">
                    <div className="row bg-white login-box w-100">
                        <div className="col-lg-6 left-box">
                            <div className="row align-items-center">
                                <div className="header-text my-4">
                                    <h4 className="mb-2">Sign In !
                                        <span>
                                            <FaUserCog style={{ marginLeft: "13px", marginBottom: "2px" }} />
                                        </span>
                                    </h4>
                                    <p>Hello there, sign in to continue!</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="">
                                        <label htmlFor="email" className="form-label">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter Your Email Address"
                                            autoComplete='off'
                                            value={formData?.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="">
                                        {/* <label htmlFor="password" className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter Your Password"
                                        autoComplete='off'
                                        value={formData?.password}
                                        onChange={handleChange}
                                        required
                                    /> */}

                                        <label htmlFor="password" className="form-label">Password:</label>
                                        <div className="input-group">
                                            <input
                                                style={{ borderRadius: "10px" }}
                                                type={showpassword ? "text" : "password"}
                                                name="password"
                                                id="password"
                                                className="form-control"
                                                placeholder="Enter Your Password"
                                                autoComplete='off'
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span
                                                onClick={PasswordShowHide}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    border: "0",
                                                    color: '#000',
                                                    backgroundColor: "transparent",
                                                    cursor: 'pointer',
                                                    zIndex: "999"
                                                }}
                                            >
                                                {showpassword ? <IoEyeSharp size={24} /> : <FaEyeSlash size={24} />}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="">
                                        {/* <button
                                        className={`login-btn ${loading ? 'btn-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading && loaders.small}
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </button> */}
                                        <button
                                            className={`login-btn ${loading ? 'btn-loading' : ''}`}
                                            disabled={loading}
                                        >
                                            {loading && loaders.small}
                                            {loading ? 'Signing In...' : 'Sign In'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 right-box">
                            <div className="glass-effect d-flex justify-content-center align-items-center">
                                {/* <h2>Very Good Works Are Watting For You 😉</h2> */}
                                {/* <h2>Medilink</h2> */}
                                {/* <h5 className="mt-3">Sign In 🤞</h5> */}
                                <img src={login_logo} className="login-logo" draggable="false" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login