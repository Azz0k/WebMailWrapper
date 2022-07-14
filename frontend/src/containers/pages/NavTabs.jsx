import React,{useEffect, useState}  from "react";
import Status from "../components/Status/Status";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../service";
import {Error} from "../reducers";
import UsersList from "../components/UsersList/UsersList";

const SelectDomain =({domains, selectedDomain, onChange})=>{
    const options = domains.map((element,index) =>
            <option value={element} key={index}>{element}</option>
    );
    return(
            <select className="form-select form-select-sm w-25" aria-label="Domains select" value={selectedDomain} onChange={onChange}>
                {options}
            </select>
    );
};

const NavTabs = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState({});
    const [userData, setUserData] = useState({});
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('energospb.ru');
    useEffect(()=>{
        apiClient.get('/users')
            .then(response => {
             setUsers(response.data);
             let temp =[];
             for (const key in response.data){
                 temp.push(key);
             }
             setDomains(temp);
            })
            .catch(error=> dispatch(Error(error.message)));
        },[]
    );
    const handleChangeDomain = (event) => {
        setSelectedDomain(event.target.value);
    };
    return(
      <>
          <nav className="navbar bg-light m-1000">
            <div className="container-fluid">
                <a className="navbar-brand">Select domain:</a>
                <SelectDomain domains={domains} selectedDomain={selectedDomain} onChange={(e)=>handleChangeDomain(e)} />
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
          </nav>

          <div className="d-flex align-items-start mt-3">
              <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist"
                   aria-orientation="vertical">
                  <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill"
                          data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                          aria-selected="true">Status
                  </button>
                  <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill"
                          data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile"
                          aria-selected="false">Users
                  </button>
                  <button className="nav-link" id="v-pills-disabled-tab" data-bs-toggle="pill"
                          data-bs-target="#v-pills-disabled" type="button" role="tab" aria-controls="v-pills-disabled"
                          aria-selected="false" >Groups
                  </button>
                  <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill"
                          data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages"
                          aria-selected="false">Redirectors
                  </button>
                  <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill"
                          data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings"
                          aria-selected="false">Aliases
                  </button>
              </div>
              <div className="tab-content" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel"
                       aria-labelledby="v-pills-home-tab" tabIndex="0">
                      <Status users={users}/>
                  </div>
                  <div className="tab-pane fade" id="v-pills-profile" role="tabpanel"
                       aria-labelledby="v-pills-profile-tab" tabIndex="0">
                      <UsersList users={users[selectedDomain]} />
                  </div>
                  <div className="tab-pane fade" id="v-pills-disabled" role="tabpanel"
                       aria-labelledby="v-pills-disabled-tab" tabIndex="0">3
                  </div>
                  <div className="tab-pane fade" id="v-pills-messages" role="tabpanel"
                       aria-labelledby="v-pills-messages-tab" tabIndex="0">4
                  </div>
                  <div className="tab-pane fade" id="v-pills-settings" role="tabpanel"
                       aria-labelledby="v-pills-settings-tab" tabIndex="0">5
                  </div>
              </div>
          </div>
      </>
    );
}



export default NavTabs;