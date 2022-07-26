import React,{useEffect, useState}  from "react";
import Status from "../components/Status/Status";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../service";
import {Error} from "../reducers/LoginSlice";
import {Search} from "../reducers/SearchSlice";
import UsersList from "../components/UsersList/UsersList";

const NavBar = ({children}) => {
    return(
                 <nav className="navbar bg-light m-1000">
            <div className="container-fluid">
                <a className="navbar-brand">Выберите домен:</a>
                {children}
            </div>
          </nav>
    );
};

const SearchForm = ({value, handleSubmit, handleChange}) => {
  return(
      <form className="d-flex" role="search"
            onSubmit={(event)=>handleSubmit(event)}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                value={value}
                           onChange={(event)=>handleChange(event.target.value)}/>
                        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
  );
};

const SelectItem =({items, value, onValueChange, propClassName})=>{
    const options = items.map((element, index) =>
            <option value={element} key={index}>{element}</option>
    );
    return(
            <select
                className={"form-select form-select-sm "+propClassName}
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
            >
                {options}
            </select>
    );
};

const ListItem = ({active, value, id, onItemClick}) => {
    const clsName = active?" active":"";
    return(
        <li className={"list-group-item "+clsName}
                id={id}
                onClick={onItemClick}
        >
            {value}
        </li>
    );
};

const VerticalTabList = ({items, selectedItem, handleItemSelect}) => {
    const buttons = items.map((e,i)=><ListItem value={e} active={i===selectedItem} key={i} onItemClick={()=>handleItemSelect(i)}/>);
    return(
        <ul className="list-group">

            {buttons}
        </ul>
    );
};

const TabPane = ({children, isActive}) => {
    const clnName = isActive?" show active":"";
    return(
          <div className={"tab-pane fade"+clnName}
               role="tabpanel"
          >
              {children}
          </div>
    );
}

const TabContent = ({selectedItem, items}) => {
    const tabItems = items.map((e,i) => <TabPane isActive={selectedItem===i} key={i} >{e}</TabPane>);
    return(
        <div className="tab-content ms-3">
            {tabItems}
        </div>
    );
};


const NavTabs = () => {
    const tabMenuItems = ["Status", "Users", "Groups", "Redirectors", "Aliases"];
    const [activeTab, setActiveTab] = useState(0);
    const dispatch = useDispatch();
    const [users, setUsers] = useState({});
    const [userData, setUserData] = useState({});
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('energospb.ru');
    const [searchFieldData, setSearchFieldData] = useState('');
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
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        dispatch(Search(searchFieldData));
    };
    const tabPanelItems = [<Status users={users}/>,<UsersList users={users[selectedDomain]} domain={selectedDomain}/>,3,4,5];
    return(
      <>
          <NavBar>
              <SelectItem
                  items={domains}
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                  propClassName="w-25"
                />
              <SearchForm
                  value={searchFieldData}
                  handleChange={setSearchFieldData}
                  handleSubmit={handleSearchSubmit}
              />
          </NavBar>
          <div className="d-flex align-items-start mt-3">
              <VerticalTabList items={tabMenuItems} selectedItem={activeTab} handleItemSelect={setActiveTab}/>
              <TabContent items={tabPanelItems} selectedItem={activeTab}/>
          </div>
      </>
    );
}



export default NavTabs;