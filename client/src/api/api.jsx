import axiosClient from "./axiosClient";

export const api = {
  //GET
  getAStudentInfo: (ID, params) => {
    const url = "student/" + String(ID);
    return axiosClient.get(url, params);
  },
  getStudentInfoArr: (params) => {
    const url = "student";
    return axiosClient.get(url, params);
  },
  getClassList: (params) => {
    const url = "class";
    return axiosClient.get(url, params);
  },
  getSubjectReports: (params) => {
    const url = "subject-report";
    return axiosClient.get(url, params);
  },
  getTermReports: (params) => {
    const url = "term-report";
    return axiosClient.get(url, params);
  },
  getSettingList: (params) => {
    const url = "setting";
    return axiosClient.get(url, params);
  },
  getSubjectList: (params) => {
    const url = "subject";
    return axiosClient.get(url, params);
  },
  getTermList: (params) => {
    const url = "term";
    return axiosClient.get(url, params);
  },
  // getSchoolYearList: (params) => {
  //   const url = "schoolYear";
  //   return axiosClient.get(url, params);
  // },
  getGradeList: (params) => {
    const url = "grade";
    return axiosClient.get(url, params);
  },
  getClassDetail: (params) => {
    const url = "class-detail";
    return axiosClient.get(url, params);
  },
  getA_ClassDetail: (id, params) => {
    const url = "class-detail/" + String(id);
    return axiosClient.get(url, params);
  },
  getTermScores: (params) => {
    const url = "term-score";
    return axiosClient.get(url, params);
  },
  getSubjectScore: (params) => {
    const url = "subject-score";
    return axiosClient.get(url, params);
  },
  getParamList: (params) => {
    const url = "param";
    return axiosClient.get(url, params);
  },
  getUserList: (params) => {
    const url = "user";
    return axiosClient.get(url, params);
  },
  getAUser: (id, params) => {
    const url = "user/" + String(id);
    return axiosClient.get(url, params);
  },

  //POST******************************************************
  postStudentInfo: (payload) => {
    const url = "student";
    return axiosClient.post(url, payload);
  },
  postClass: (payload) => {
    const url = "class";
    return axiosClient.post(url, payload);
  },
  postSubject: (payload) => {
    const url = "subject";
    return axiosClient.post(url, payload);
  },
  postClassDetai: (payload) => {
    const url = "class-detail";
    return axiosClient.post(url, payload);
  },
  postSubjectScore: (payload) => {
    const url = "subject-score";
    return axiosClient.post(url, payload);
  },
  postTermScore: (payload) => {
    const url = "term-score";
    return axiosClient.post(url, payload);
  },
  postSubjectReport: (payload) => {
    const url = "subject-report";
    return axiosClient.post(url, payload);
  },
  postTermReport: (payload) => {
    const url = "term-report";
    return axiosClient.post(url, payload);
  },
  postUser: (payload) => {
    const url = "user";
    return axiosClient.post(url, payload);
  },

  //PUT***************************
  putSubject: (id, payload) => {
    const url = "subject/" + String(id);
    return axiosClient.put(url, payload);
  },
  putClass: (id, payload) => {
    const url = "class/" + String(id);
    return axiosClient.put(url, payload);
  },
  putSetting: (id, payload) => {
    const url = "setting/" + String(id);
    return axiosClient.put(url, payload);
  },
  putTermScore: (id, payload) => {
    const url = "term-score/" + String(id);
    return axiosClient.put(url, payload);
  },
  putSubjectScore: (id, payload) => {
    const url = "subject-score/" + String(id);
    return axiosClient.put(url, payload);
  },
  putStudentInfo: (id, payload) => {
    const url = "student/" + String(id);
    return axiosClient.put(url, payload);
  },
  putClassDetail: (id, payload) => {
    const url = "class-detail/" + String(id);
    return axiosClient.put(url, payload);
  },
  putUser: (id, payload) => {
    const url = "user/" + String(id);
    return axiosClient.put(url, payload);
  },

  //DELETE*****************************
  deleteSubject: (id) => {
    const url = "subject/" + String(id);
    return axiosClient.delete(url);
  },
  deleteStudent: (id) => {
    const url = "student/" + String(id);
    return axiosClient.delete(url);
  },
  deleteClass: (id) => {
    const url = "class/" + String(id);
    return axiosClient.delete(url);
  },
  deleteClassDetail: (id) => {
    const url = "class-detail/" + String(id);
    return axiosClient.delete(url);
  },
  deleteTermScore: (id) => {
    const url = "term-score/" + String(id);
    return axiosClient.delete(url);
  },
  deleteSubjectScore: (id) => {
    // console.log("delete from api");
    const url = "subject-score/" + String(id);
    return axiosClient.delete(url);
  },
  deleteSubjectReport: (id) => {
    // console.log("delete from api");
    const url = "subject-report/" + String(id);
    return axiosClient.delete(url);
  },
  deleteTermReport: (id) => {
    // console.log("delete from api");
    const url = "term-report/" + String(id);
    return axiosClient.delete(url);
  },
  deleteUser: (id) => {
    // console.log("delete from api");
    const url = "user/" + String(id);
    return axiosClient.delete(url);
  },
};
