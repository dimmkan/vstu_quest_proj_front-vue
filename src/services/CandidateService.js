import axios from 'axios';
import * as R from 'ramda';

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

function getPayload() {
  let payload = localStorage.payload;
  if (typeof localStorage.payload === 'string') payload = JSON.parse(localStorage.payload);
  return payload
}

function getTS(date) {
  const pad = (num) => num < 10 ? '0' + num : num;
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

export default class UserService {
  getCandidates() {
    return instance.get('/candidates').then((response) => response.data.map((item) => {
      return {
        ...item,
        birthday: new Date(item.birthday),
        checkStartDate: new Date(item.checkStartDate),
        checkEndDate: new Date(item.checkEndDate),
      }
    }));
  }

  createCandidate(candidateEntity) {
    const payload = getPayload();
    if (typeof candidateEntity.birthday === 'object') {
      candidateEntity.birthday = getTS(candidateEntity.birthday);
    }
    if (typeof candidateEntity.checkStartDate === 'object') {
      candidateEntity.checkStartDate = getTS(candidateEntity.checkStartDate);
    }
    if (typeof candidateEntity.checkEndDate === 'object') {
      candidateEntity.checkEndDate = getTS(candidateEntity.checkEndDate);
    }
    const data = {
      ...candidateEntity,
      username: payload.login,
    }
    return instance.post('/candidates/add', data).then(response => response.data)
  }

  updateCandidate(candidateEntity) {
    const payload = getPayload();
    if (typeof candidateEntity.birthday === 'object') {
      candidateEntity.birthday = getTS(candidateEntity.birthday);
    }
    if (typeof candidateEntity.checkStartDate === 'object') {
      candidateEntity.checkStartDate = getTS(candidateEntity.checkStartDate);
    }
    if (typeof candidateEntity.checkEndDate === 'object') {
      candidateEntity.checkEndDate = getTS(candidateEntity.checkEndDate);
    }
    const data = {
      ...R.omit(['id'], candidateEntity),
      username: payload.login,
    }
    return instance.put(`/candidates/update/${candidateEntity.id}`, data).then(response => response.data).catch(console.log)
  }

  deleteCandidate(candidateID) {
    const payload = getPayload();
    return instance.delete(`/candidates/delete/${candidateID}`, { data: { username: payload.login } });
  }

  uploadQuestionnaries(file, id) {
    const payload = getPayload();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", payload.login);
    return instance.post(`/candidates/addquest/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data).catch(console.log);
  }

  deleteQuestionnaries(id) {
    const payload = getPayload();
    return instance.delete(`/candidates/deletequest/${id}`, { data: { username: payload.login } });
  }

  uploadWorkbook(file, id) {
    const payload = getPayload();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", payload.login);
    return instance.post(`/candidates/addworkbook/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data).catch(console.log);
  }

  deleteWorkbook(id) {
    const payload = getPayload();
    return instance.delete(`/candidates/deleteworkbook/${id}`, { data: { username: payload.login } });
  }

  changePassword(newpass) {
    const payload = getPayload();
    return instance.post(`/users/refreshpass/${payload.userId}`, { newpass });
  }

}