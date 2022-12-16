import axios from "axios";
import { encodedToken } from "../../utils/generic";
import {
  DROP_COLLECTION,
  GET_DAILY_FAILURE,
  GET_DAILY_REQUEST,
  GET_DAILY_SUCCESS,
  GET_INITIAL_DAILY_SUCCESS,
  GET_INITIAL_MONTHLY_SUCCESS,
  GET_MONTHLY_FAILURE,
  GET_MONTHLY_REQUEST,
  GET_MONTHLY_SUCCESS,
  GET_MPANS_SUCCESS,
  POST_DAILY_FAILURE,
  POST_DAILY_REQUEST,
  POST_DAILY_SUCCESS,
  SET_DAILY_DATA,
  SET_HH_DATA,
  SET_INITIAL_HH_DUMP,
  SET_MONTHLY_DATA,
  SET_MPANS,
  GET_INITIAL_WEEKLY_SUCCESS,
  GET_WEEKLY_REQUEST,
  GET_WEEKLY_FAILURE,
  GET_WEEKLY_SUCCESS,
  SET_WEEKLY_DATA,
  PUT_DAILY_REQUEST,
  PUT_DAILY_SUCCESS,
  PUT_DAILY_FAILURE,
  GET_UPDATED_MONTHLY,
  SET_USER_ID,
  DROP_COLLECTION_SUCCESS,
  SET_FILENAME,
  REQUEST_UPDATED_MONTHLY
} from "../constants/actionTypes";

// export const getToken=(id)=>{
//   const username = id;
//   const password = './xqj5ddt0';
//   const token =`${username}:${password}`;
//   const encodedToken =  Buffer.from(token).toString('base64');
//   return{
//     type:SET_USER_ID,
//     username
//   }
// }

/*START OF UPDATING STATES*/
export const setHhData = (hhData) => {
  return {
    type: SET_HH_DATA,
    hhData,
  };
};

export const setInitialHhDump = (hhDump) => {
  return {
    type: SET_INITIAL_HH_DUMP,
    hhDump,
  };
};
export const updateMpan = (mpans) => {
  return {
    type: SET_MPANS,
    mpans,
  };
};

export const setDaily = (daily) => {
  return {
    type: SET_DAILY_DATA,
    daily,
  };
};

export const setWeekly =(weekly)=>{
  return{
    type: SET_WEEKLY_DATA,
    weekly
  }
}

export const setMonthly = (monthly) => {
  return {
    type: SET_MONTHLY_DATA,
    monthly,
  };
};

export const setFileName =(fileName)=>{
  return{
    type: SET_FILENAME,
    fileName
  }
}
/*END OF UPDATING STATE*/

/*POST DAILY START*/
export const postDailyRequest = (token) => {
  return {
    type: POST_DAILY_REQUEST,
    token
  };
};

export const postDailySuccess = (postSuccess,hhData) => {
  return {
    type: POST_DAILY_SUCCESS,
    postSuccess,
    hhData
  };
};

export const postDailyFailure = (error) => {
  return {
    type: POST_DAILY_FAILURE,
    error,
  };
};

export const postDaily = (hhData,token) => {
  return (dispatch) => {
    dispatch(postDailyRequest(token));
    axios({
      url: "http://localhost:4000/postDaily",
      method: "post",
      data: hhData,
      headers: { Authorization: "Basic " + token },
    })
      .then((response) => {
        //console.log("response data", response);
        dispatch(postDailySuccess(true,response.data));
        //dispatch(getDaily());// fetching daily after successful post
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(postDailyFailure(error));
      });
  };
};

//*MULTER POST DATA*//
export const postTransformData = (hhData,token) => {
  return (dispatch) => {
    dispatch(postDailyRequest(token));
    axios({
      // url: "http://localhost:4000/postTransformData",
      url: "/postTransformData",
      method: "post",
      data: hhData,
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + token },
    })
      .then((response) => {
        dispatch(postDailySuccess(true,response.data.hhObj));
        //dispatch(getDaily());// fetching daily after successful post
      })
      .catch((error) => {
        console.log("transform Data error=", error.response.data.msg);
        dispatch(postDailyFailure(error.response.data.msg));
      });
  };
};
/*POST DAILY END*/

/*PUT DAILY START*/
export const putDailyRequest = () => {
  return {
    type: PUT_DAILY_REQUEST,
  };
};

export const putDailySuccess = (postSuccess,optiMapArr) => {
  return {
    type: PUT_DAILY_SUCCESS,
    postSuccess,
    optiMapArr
  };
};

export const putDailyFailure = (error) => {
  return {
    type: PUT_DAILY_FAILURE,
    error,
  };
};

export const putDailyEdited = (data,token) => {
  return (dispatch) => {
    dispatch(putDailyRequest());
    axios({
      // url: "http://localhost:4000/editDaily",
      url: "/editDaily",
      method: "put",
      data: data, //data is edited aggregated mpan,month,year and %
      headers: { Authorization: "Basic " + token },
    })
      .then((response) => {
        // console.log("response put daily edited", response);
        dispatch(putDailySuccess(true,response.data));
        dispatch(getDaily(token));
        dispatch(getMonthly(token));
      })
      .catch((error) => {
        console.log("redux error", error);
        dispatch(putDailyFailure(error));
      });
  };
};
/*PUT DAILY END*/

/* DAILY FETCH START */
export const getDailyRequest = () => {
  return {
    type: GET_DAILY_REQUEST,
  };
};

export const getDailySuccess = (daily) => {
  return {
    type: GET_DAILY_SUCCESS,
    daily
    };
};

export const getInitialDailySuccess =(initialDaily)=>{
  return{
    type:GET_INITIAL_DAILY_SUCCESS,
    initialDaily
  };
}

export const getDailyFailure = (error) => {
  return {
    type: GET_DAILY_FAILURE,
    error,
  };
};

export const getDaily = (token) => {
  return async (dispatch) => {
    dispatch(getDailyRequest());
    try {
      const res = await axios({
        // url: "http://localhost:4000/getDaily",
        url: "/getDaily",
        method: "get",
        headers: { Authorization: "Basic " + token },
      });
      console.log("redux getDaily", res.data);
      dispatch(getDailySuccess(res.data));
      dispatch(getInitialDailySuccess(res.data));
    } catch (error) {
      dispatch(getDailyFailure(error.message));
      console.log(error);
    }
  };
};
/*DAILY FETCH END*/

/*START OF GET UPDATED MONTHLY AFTER EDIT CALL*/
export const requestUpdatedMonthly=(loading)=>{
  return{
    type:REQUEST_UPDATED_MONTHLY,
    loading
  }
}
export const getUpdatedMonthly=(updatedMonth)=>{
  return{
    type:GET_UPDATED_MONTHLY,
    updatedMonth
  }
}

// export const fireUpdatedMonthly=  (selectedMpans,token) => {
//   return async (dispatch) => {
//     dispatch(requestUpdatedMonthly(true));
//     try {
//       const res = await axios({
//         url: `http://localhost:4000/getUpdMonthly/?sm=${selectedMpans}`,
//         method: "get",
//         headers: { Authorization: "Basic " + token },
//       });
//       console.log("Upd Monthly data", res.data);
//       dispatch(getUpdatedMonthly(res.data));
//     } catch (error) {
//       console.log(error);
//     }
// }
// }
export const fireUpdatedMonthly=  (selectedMpans,token) => {
  return  (dispatch) => {
    dispatch(requestUpdatedMonthly(true));
    axios({
      // url: `http://localhost:4000/getUpdMonthly/?sm=${selectedMpans}`,
      url: `/getUpdMonthly/?sm=${selectedMpans}`,
      method: 'get',
      headers: { Authorization: "Basic " + token },
   })
   .then(response => {
      dispatch(getUpdatedMonthly(response.data));
   }) 
   .catch(err => {
      console.log(err);
   });
}
}
/*END OF GET UPDATED MONTHLY AFTER EDIT CALL*/

/* WEEKLY FETCH START */
export const getWeeklyRequest = () => {
  return {
    type: GET_WEEKLY_REQUEST,
  };
};

export const getWeeklySuccess = (weekly) => {
  return {
    type: GET_WEEKLY_SUCCESS,
    weekly
    };
};

export const getInitialWeeklySuccess =(initialWeekly)=>{
  return{
    type:GET_INITIAL_WEEKLY_SUCCESS,
    initialWeekly
  };
}

export const getWeeklyFailure = (error) => {
  return {
    type: GET_WEEKLY_FAILURE,
    error,
  };
};

export const getWeekly = (token) => {
  return async (dispatch) => {
    dispatch(getWeeklyRequest());
    try {
      const res = await axios({
        // url: "http://localhost:4000/getWeekly",
        url: "/getWeekly",
        method: "get",
        headers: { Authorization: "Basic " + token },
      });
      console.log("redux getWeekly", res.data);
      dispatch(getWeeklySuccess(res.data));
      dispatch(getInitialWeeklySuccess(res.data));
    } catch (error) {
      dispatch(getWeeklyFailure(error.message));
      console.log(error);
    }
  };
};
/*WEEKLY FETCH END*/

/*MONTHLY FETCH START*/
export const getMonthlyRequest = () => {
  return {
    type: GET_MONTHLY_REQUEST,
  };
};

export const getMonthlySuccess = (monthly) => {
  return {
    type: GET_MONTHLY_SUCCESS,
    monthly
  };
};

export const getInitialMonthlySuccess =(initialMonthly)=>{
  return{
    type:GET_INITIAL_MONTHLY_SUCCESS,
    initialMonthly
  };
}

export const getMonthlyFailure = (error) => {
  return {
    type: GET_MONTHLY_FAILURE,
    error,
  };
};

export const getMonthly = (token) => {
  return (dispatch) => {
    dispatch(getMonthlyRequest());
    axios({
        // url: "http://localhost:4000/getMonthly",
        url: "/getMonthly",
        method: "get",
        headers: { Authorization: "Basic " + token },
      }).then((res)=>{
        console.log("redux getMonthly", res.data);
        dispatch(getMonthlySuccess(res.data));
        dispatch(getInitialMonthlySuccess(res.data));
      }).catch((error)=>{
        dispatch(getMonthlyFailure(error.message));
        console.log(error);
      })
  };
};
/*MONTHLY FETCH END */

export const dropCollection=()=>{
  return{
    type:DROP_COLLECTION,
  }
}
export const dropCollectionSuccess=(conversionDone)=>{
  return{
    type:DROP_COLLECTION_SUCCESS,
    conversionDone
  }
}
export const deleteCollection = (token) => {
  return (dispatch)=>{
    dispatch(dropCollection());
    axios({
      // url : 'http://localhost:4000/deleteUserData',
      url : '/deleteUserData',
      method: 'delete',
      headers: { 'Authorization': 'Basic '+ token }
    })
    .then(res => {
      dispatch(dropCollectionSuccess(true));
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  }

}

export const getMpanSuccess=(mpans)=>{
  return{
    type:GET_MPANS_SUCCESS,
    mpans
  }
}

export const getMpans = (token) => {
  return  (dispatch) => {
      axios({
        // url : 'http://localhost:4000/getMpans',
        url : '/getMpans',
        method: 'get',
        headers: { 'Authorization': 'Basic '+ token }
      })
      .then(res=>{
        console.log("redux getMpans", res.data);
        dispatch(getMpanSuccess(res.data));
      }).catch((error)=>{
        console.log(error);
      })
  };
};

