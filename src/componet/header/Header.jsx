import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

import User from "../../assets/images/dash-user.png";

import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { ProfileIcon } from '../../assets/IconsList';


const Header = ({ mobileToggle, setMobileToggle, handleLogout }) => {

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    useEffect(() => {
        if (pathname.startsWith("/admin/")) {
            const path = pathname.replace("/admin", "");

            if (path === "/dashboard") {
                setTitle("Dashboard")
            }
            if (path === "/registeruser") {
                setTitle("Register User List")
            }
            if (path === "/user") {
                setTitle("Client")
            }

            if (path.startsWith("/forms")) {
                setTitle("Forms");
            }
            if (path === "/company") {
                setTitle("Add partner")
            }

        }
    }, [pathname]);
    return (
        <div className="nav navbar navbar-expand-xl navbar-light iq-navbar">
            <div className="container-fluid navbar-inner">
                <h5 className="site-menu-title mb-0 gap-4 d-flex align-items-center">

                     Admin Panel
                    {/* {title || ""} */}
                    {/* Dashboard */}
                </h5>

                <ul className="navbar-nav navbar-list ms-auto">
                    <li className="nav-item dropdown">
                        {/* Dropdown toggle */}
                        <button
                            className="nav-link d-flex align-items-center position-relative ps-3 p-0 bg-transparent border-0"
                            id="profile-dropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {/* <img
                                src={User}
                                alt="User-Profile"
                                width={43}
                                height={43}
                                className="theme-color-default-img img-fluid avatar avatar-40 avatar-rounded"
                                loading="lazy"
                            /> */}
                            <ProfileIcon/>
                        </button>

                        {/* Dropdown menu */}
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-dropdown">
                            <li>
                                <button
                                    className="dropdown-item fw-semibold"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </li>

                </ul>
                {/* <button id="btn-toggle" className="border-0 sidebar-toggler break-point-sm btn-line" onClick={() => setMobileToggle(!mobileToggle)}>
                    <i className="ri-menu-line ri-xl" />
                </button> */}
            </div>
        </div>
    )
}

export default Header
