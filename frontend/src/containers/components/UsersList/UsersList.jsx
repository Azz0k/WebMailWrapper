import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error} from "../../reducers";

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
    const dispatch = useDispatch();
    useEffect(()=>{
        apiClient.get("/1.0/"+domain)
            .then(response => {
                setUserSettings(response.data)
            })
            .catch(error=> dispatch(Error(error.message)));

    },[users]);

    const listItems = users===undefined?false:users.map((element, index) =>
        <li className="list-group-item vw-90" key={index}>{
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
        </div>
    );
};

export default UsersList;