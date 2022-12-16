import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
import * as types from "../constants/actionTypes";

const demoInitialState = {
  loading: false,
  conversionDone: false,
  token: "",
  hhData: "",
  daily: [],
  initialDaily: [],
  weekly: [],
  initialWeekly: [],
  monthly: [],
  initialMonthly: [],
  error: "",
  postSuccess: false,
  mpans: "",
  optiMapArr: "",
  updatedMonth: "",
  fileName: "",
  updatedMonthlyLoading:true,
};

export default function demoReducer(state = demoInitialState, action) {
  switch (action.type) {
    case types.SET_MPANS:
      return { ...state, mpans: action.mpans };
    case types.SET_DAILY_DATA:
      return { ...state, daily: action.daily };
    case types.SET_WEEKLY_DATA:
      return { ...state, weekly: action.weekly };
    case types.SET_MONTHLY_DATA:
      return { ...state, monthly: action.monthly };
    case types.SET_HH_DATA:
      return { ...state, hhData: action.hhData };
    case types.SET_FILENAME:
      return { ...state, fileName: action.fileName };
    case types.GET_DAILY_REQUEST:
      return { ...state, loading: true };
    case types.GET_DAILY_SUCCESS:
      return { ...state, daily: action.daily, loading: false, error: "" };
    case types.GET_INITIAL_DAILY_SUCCESS:
      return { ...state, initialDaily: action.initialDaily };
    case types.GET_DAILY_FAILURE:
      return { ...state, daily: [], loading: false, error: action.error };

    case types.GET_WEEKLY_REQUEST:
      return { ...state, loading: true };
    case types.GET_WEEKLY_SUCCESS:
      return { ...state, weekly: action.weekly, loading: false, error: "" };
    case types.GET_INITIAL_WEEKLY_SUCCESS:
      return { ...state, initialWeekly: action.initialWeekly };
    case types.GET_WEEKLY_FAILURE:
      return { ...state, weekly: [], loading: false, error: action.error };

    case types.GET_MONTHLY_REQUEST:
      return { ...state, loading: true };
    case types.GET_MONTHLY_SUCCESS:
      return { ...state, monthly: action.monthly, loading: false, error: "" };
    case types.GET_INITIAL_MONTHLY_SUCCESS:
      return { ...state, initialMonthly: action.initialMonthly };
    case types.GET_MONTHLY_FAILURE:
      return { ...state, monthly: [], loading: false, error: action.error };
    case types.GET_UPDATED_MONTHLY:
      return { ...state, updatedMonth: action.updatedMonth,updatedMonthlyLoading:false };
    case types.REQUEST_UPDATED_MONTHLY:
      return { ...state, updatedMonthlyLoading: action.loading };

    case types.POST_DAILY_REQUEST:
      return { ...state, loading: true, token: action.token };
    case types.POST_DAILY_SUCCESS:
      return {
        ...state,
        postSuccess: action.postSuccess,
        loading: false,
        hhData: action.hhData,
      }; //
    case types.POST_DAILY_FAILURE:
      return { ...state, daily: [], loading: false, error: action.error };

    case types.PUT_DAILY_REQUEST:
      return { ...state, loading: true };
    case types.PUT_DAILY_SUCCESS:
      return {
        ...state,
        postSuccess: action.postSuccess,
        loading: false,
        optiMapArr: action.optiMapArr,
      }; //update daily and monthly here
    case types.PUT_DAILY_FAILURE:
      return { ...state, daily: [], loading: false, error: action.error };

    case types.GET_MPANS_SUCCESS:
      return { ...state, mpans: action.mpans };
    case types.DROP_COLLECTION:
      // return { ...state };
      return { ...state, loading: true };
    case types.DROP_COLLECTION_SUCCESS:
      return {
        ...state,
        conversionDone: action.conversionDone,
        loading: false,
        postSuccess: false,
      };
    default:
      return { ...state };
  }
}
