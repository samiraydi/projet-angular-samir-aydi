//@ts-ignore
import _DB from '../assets/_db.json';

const APP_NAME = "LAB_APP";


export function getGlobal() {
  const localData = localStorage.getItem(APP_NAME);
  if (!localData) {
    setGlobal(_DB);
  }
  return localData ? JSON.parse(localData) : _DB;
}

export function setGlobal(data: any) {
  localStorage.setItem(APP_NAME, JSON.stringify(data));
}

