import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error} from "../../reducers";

const UsersList = ({users}) => {
    const listItems = users===undefined?false:users.map((element, index) => <li className="list-group-item vw-90" key={index}>{element}</li>);
    return(
        <div className="overflow-auto vh-80">
            <ul className="list-group">
                {listItems}
            </ul>
        </div>
    );
};

export default UsersList;