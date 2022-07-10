import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import apiClient from "../service/site-service";
import {useQuery} from "react-query";
import {Login} from "../reducers";

const Status = () => {

    const dispatch = useDispatch();
    return(
      <div>
          <h1>Hello World"</h1>

      </div>
    );
}



export default Status;