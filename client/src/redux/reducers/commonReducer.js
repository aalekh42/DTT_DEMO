import * as types from "../constants/actionTypes";

const commonInitialState = {
  hhData: null,
  hhDump: null,
  filteredMpan: [],
  filterDaily: null,
  weekly: null,
  filterMonthly: null,
};

export default function commonReducer(state = commonInitialState, action) {
  switch (action.type) {
    // case types.SET_HH_DATA:
    //   return { ...state, hhData: action.hhData };
    case types.SET_INITIAL_HH_DUMP:
      return { ...state, hhDump: action.hhDump };
    case types.SET_DAILY_DATA:
      return { ...state, filterDaily: action.daily };
    case types.SET_MONTHLY_DATA:
      return { ...state, filterMonthly: action.monthly };
    default:
      return { ...state };
  }
}
