import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error} from "../../reducers";

const UsersList = ({users}) => {
    const listItems = users.map((el, index)=> <li className="list-group-item vw-90" key={index}>{el}</li>);
    return(
        <>
            <ul className="list-group">
                {listItems}
            </ul>
        </>
    );
};

export default UsersList;