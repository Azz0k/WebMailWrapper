import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error} from "../../reducers/GlobalSlice";
import {Modal} from "bootstrap";
import ModalComponent from "../ModalComponent/ModalComponent";
import {selectSearch} from "../../reducers/GlobalSlice";


const check_undefined = (sourceObj, firstKey, secondKey, length) => {
    if (sourceObj===undefined){
        return "".padEnd(length);
    }
    if (sourceObj[firstKey]===undefined){
        return "".padEnd(length);
    }
    if (sourceObj[firstKey][secondKey]===undefined){
        return "".padEnd(length);
    }
    let result = sourceObj[firstKey][secondKey];
    if (result.length>length-3){
        return result.substring(0,length-3)+"...";
    }
    else {
        return result.padEnd(length);
    }
}

const UsersList = ({users, domain}) => {
    const [usersSettings, setUserSettings] = useState({});
    const [selectedUser, setSelectedUser] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const searchFieldData = useSelector(selectSearch);
    const dispatch = useDispatch();
    useEffect(()=>{
        apiClient.get("/1.0/"+domain)
            .then(response => {
                setUserSettings(response.data)
            })
            .catch(error=> dispatch(Error(error.message)));

    },[users]);
    const defaultClassName = "list-group-item vw-90";
    const activeClassName = "active list-group-item vw-90";
    const filteredUsers = searchFieldData ===''? users:users.filter(u => u.includes(searchFieldData));
    const listItems = filteredUsers===undefined?false:filteredUsers.map((element, index) =>
        <li className={index===selectedUser?activeClassName:defaultClassName}
            id={index} key={index}
            onClick={()=>setSelectedUser(index)}
            onDoubleClick={()=>setShowModal(true)}> {
            element.padEnd(30)+
            check_undefined(usersSettings,element,'RealName', 40)+
            check_undefined(usersSettings,element,'description',60)+
            check_undefined(usersSettings,element,'ou',40)+
            check_undefined(usersSettings,element,'MaxAccountSize', 40)

        }</li>);
    return(
        <div className="overflow-auto vh-80">
            <ul className="list-group">
                <pre>{listItems}</pre>
            </ul>
            <ModalComponent
                title={filteredUsers && filteredUsers[selectedUser]}
                show={showModal} hide={()=>setShowModal(false)}>
            </ModalComponent>
        </div>
    );
};

export default UsersList;