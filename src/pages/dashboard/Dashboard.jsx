import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { DashboardContent } from '../../componet/constants/Data';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
const Dashboard = () => {

  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();

  const Dashboard = async () => {
      try {
          const res = await Axios.get(apiendpoints.dashboard, authorizationHeaders());

          if (res.data?.status) {
              setDashboard(res.data?.data);
          }

      } catch (err) {
          console.error(err);
      }
  }

  useEffect(() => {
      Dashboard();
  }, []);

  return (
    <>

      <div className="dashboard">
        <div className="row gx-5 mb-5">

          {
            DashboardContent?.map((i, index) => {
              return (
                <div className="col-xl-4 col-md-6 col-12" key={index} style={{ cursor: "pointer" }}>
                  <Link to={i.route}>
                    <div className="card shadow border-0">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col">
                            <span className="h6 fw-semibold text-muted text-sm d-block mb-2 title">
                              {i.title}
                            </span>
                            <span className="mb-0 card-title">
                              {dashboard[i.apiCount] || 0}
                            </span>
                          </div>
                          <div className="col-auto">
                            <div className="icon icon-shape bg-tertiary text-dark text-lg rounded-circle">
                              {i.icon}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })
          }

        </div>
      </div>

    </>
  )
}

export default Dashboard