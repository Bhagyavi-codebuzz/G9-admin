import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import Logout from './../modal/logout/Logout';

const DefaultLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("admin-G9-token");

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token]);

    const [mobileToggle, setMobileToggle] = useState(false);

    // Logout-Modal
    const [logoutModalShow, setLogoutModalShow] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const handleLogout = () => {
        setLogoutModalShow(true);
    };

    const handleClose = () => {
        setLogoutModalShow(false);
    };

    const confirmLogout = async () => {
        setIsLogoutLoading(true);

        setTimeout(() => {
            localStorage.clear();
            navigate("/");
            setIsLogoutLoading(false);
        }, 500);
    };

    return (
        <>
            <div className="layout main-section has-sidebar fixed-sidebar fixed-header">
                {/* Sidebar */}
                <Sidebar
                    mobileToggle={mobileToggle}
                    setMobileToggle={setMobileToggle}
                    handleLogout={handleLogout}
                />

                {/* Right side */}
                <main className="layout">
                    <div className="content">
                        <Header
                            mobileToggle={mobileToggle}
                            setMobileToggle={setMobileToggle}
                            handleLogout={handleLogout}
                        />

                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Logout Modal */}
            <Logout
                show={logoutModalShow}
                handleClose={handleClose}
                isLogoutLoading={isLogoutLoading}
                handleLogout={confirmLogout}
            />
        </>
    );
};

export default DefaultLayout;
