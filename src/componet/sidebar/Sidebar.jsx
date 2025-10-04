import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom';

import logo from "../../assets/images/login-logo.svg";
import { SidebarData } from '../constants/Data';
import { RiArrowLeftSLine } from "react-icons/ri";
import logosmall from "../../assets/images/logo-small.svg";
import { IoChevronDownSharp } from "react-icons/io5";

const Sidebar = ({ mobileToggle, setMobileToggle, handleLogout }) => {
  const { pathname } = useLocation();
  const [sidebarToggle, setSidebarToggle] = useState(false); // collapsed when true
  const [openIndex, setOpenIndex] = useState(null); // which parent submenu is open

  const handleSidebarDismiss = () => {
    if (window.innerWidth <= 576) {
      setMobileToggle(!mobileToggle);
    }
  };

  // Optional: keep submenu open if current route is inside it
  useEffect(() => {
    const parentIndex = SidebarData?.findIndex(item =>
      item.children?.some(child => child.route === pathname)
    );
    setOpenIndex(parentIndex === -1 ? null : parentIndex);
  }, [pathname]);

  const handleParentClick = (e, index) => {
    e.preventDefault();

    // If collapsed, expand AND open the clicked submenu
    if (sidebarToggle) {
      setSidebarToggle(false);
      setOpenIndex(index);
      return;
    }

    // If expanded, toggle the submenu (accordion style)
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <aside
      id="sidebar"
      className={`sidebar break-point-sm has-bg-image ${sidebarToggle ? "collapsed" : ""} ${mobileToggle ? "toggled" : ""}`}
    >
      <Link id="btn-collapse" className="sidebar-collapser" onClick={() => setSidebarToggle(!sidebarToggle)}>
        <RiArrowLeftSLine />
      </Link>

      <div className="sidebar-layout">
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="pro-sidebar-logo" onClick={handleSidebarDismiss}>
            <img
              src={`${sidebarToggle ? logosmall : logo}`}
              alt="logo"
              className={`${sidebarToggle ? "logo-img" : ""}`}
              width={'100%'}
            />
          </Link>
        </div>

        <nav className="menu open-current-submenu">
          <ul className="menu">
            {SidebarData?.map((i, index) => {
              const hasChildren = i.children && i.children.length > 0;

              return (
                <li className="menu-item" key={index}>
                  {i.onClick === "logout" ? (
                    <Link onClick={handleLogout}>
                      <span className="menu-icon">{i.icon}</span>
                      <span className="menu-title">{i.label}</span>
                    </Link>
                  ) : hasChildren ? (
                    <>
                      <NavLink
                        to="#"
                        className="d-flex align-items-center justify-content-between mb-2 bg-transparent"
                        onClick={(e) => handleParentClick(e, index)}
                      >
                        <span className="d-flex align-items-center">
                          <span className="menu-icon">{i.icon}</span>
                          <span className="menu-title">{i.label}</span>
                        </span>

                        {/* optional indicator */}
                        <span className={`submenu-indicator ${openIndex === index ? 'open' : ''}`}><IoChevronDownSharp /></span>
                      </NavLink>

                      {/* only render submenu when sidebar is expanded (prevents empty space) */}
                      {!sidebarToggle && (
                        <ul id={`submenu-${index}`} className={`collapse ${openIndex === index ? 'show' : ''}`}>
                          {i.children.map((child, childIndex) => (
                            <li key={childIndex} className="menu-subitem">
                              <NavLink
                                to={child.route}
                                className="d-flex align-items-center"
                                onClick={handleSidebarDismiss}
                              >
                                <span className="menu-title">{child.label}</span>
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={i.route}
                      className="d-flex align-items-center main"
                      onClick={handleSidebarDismiss}
                    >
                      <span className="menu-icon">{i.icon}</span>
                      <span className="menu-title">{i.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
