import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPayee, defaultValue } from 'app/shared/model/payee.model';

export const ACTION_TYPES = {
  FETCH_PAYEE_LIST: 'payee/FETCH_PAYEE_LIST',
  FETCH_PAYEE: 'payee/FETCH_PAYEE',
  CREATE_PAYEE: 'payee/CREATE_PAYEE',
  UPDATE_PAYEE: 'payee/UPDATE_PAYEE',
  DELETE_PAYEE: 'payee/DELETE_PAYEE',
  RESET: 'payee/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPayee>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type PayeeState = Readonly<typeof initialState>;

// Reducer

export default (state: PayeeState = initialState, action): PayeeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PAYEE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PAYEE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PAYEE):
    case REQUEST(ACTION_TYPES.UPDATE_PAYEE):
    case REQUEST(ACTION_TYPES.DELETE_PAYEE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PAYEE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PAYEE):
    case FAILURE(ACTION_TYPES.CREATE_PAYEE):
    case FAILURE(ACTION_TYPES.UPDATE_PAYEE):
    case FAILURE(ACTION_TYPES.DELETE_PAYEE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PAYEE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_PAYEE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PAYEE):
    case SUCCESS(ACTION_TYPES.UPDATE_PAYEE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PAYEE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/payee';
// Actions

export const getEntities: ICrudGetAllAction<IPayee> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PAYEE_LIST,
    payload: axios.get<IPayee>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IPayee> = payeeID => {
  const requestUrl = `${apiUrl}/${payeeID}`;
  return {
    type: ACTION_TYPES.FETCH_PAYEE,
    payload: axios.get<IPayee>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPayee> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PAYEE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPayee> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PAYEE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPayee> = payeeID => async dispatch => {
  const requestUrl = `${apiUrl}/${payeeID}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PAYEE,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
