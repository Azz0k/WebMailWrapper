import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import apiClient from "../../service";
import {Error} from "../../reducers";

const UsersList = () => {

    return(
        <>
            <ul className="list-group">
                <li className="list-group-item active vw-90" aria-current="true">An active item</li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
                <li className="list-group-item">A fourth item</li>
                <li className="list-group-item">And a fifth one</li>
            </ul>
        </>
    );
};

export default UsersList;