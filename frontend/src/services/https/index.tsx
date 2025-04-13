import { UsersInterface } from "../../interface/IUser"

import axios from "axios";

const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};


async function GetGender() {

  return await axios

    .get(`${apiUrl}/genders`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetUsers() {

  return await axios

    .get(`${apiUrl}/users`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetUsersById(id: string) {

  return await axios

    .get(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdateUsersById(id: string, data: UsersInterface) {

  return await axios

    .put(`${apiUrl}/user/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function DeleteUsersById(id: string) {

  return await axios

    .delete(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function CreateUser(data: UsersInterface) {

  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateDataHardware(data: { date: string; data: number }) {
  return await axios
    .post(`${apiUrl}/create-data-hardware`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListDataHardware() {

  return await axios

    .get(`${apiUrl}/data-hardware`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function FindDataHardwareByDate(date: string) {
  return await axios
    .get(`${apiUrl}/hardware/by-date?date=${date}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function FindDataHardwareByWeekday(weekday: string) {
  return await axios
    .get(`${apiUrl}/data-hardware/weekday?weekday=${weekday}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function FindDataHardwareByMonth(month: number, year: number) {
  return await axios
    .get(`${apiUrl}/hardware/by-month?month=${month}&year=${year}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function FindDataHardwareByYear(year: number) {
  return await axios
    .get(`${apiUrl}/hardware/by-year?year=${year}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function FindDataHardwareByDateRange(start: string, end: string) {
  return await axios
    .get(`${apiUrl}/hardware/by-date-range?start=${start}&end=${end}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetGender,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  CreateDataHardware,
  ListDataHardware,
  FindDataHardwareByDate,
  FindDataHardwareByDateRange,
  FindDataHardwareByWeekday,
  FindDataHardwareByMonth,
  FindDataHardwareByYear,
};