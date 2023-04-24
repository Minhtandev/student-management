import React, { useState, useEffect } from "react";
import { Homepage } from "../pages/Homepage";
import { Setting } from "../pages/Setting";
import { AddClass } from "../pages/class-detail/AddClass";
import { CreateClass } from "../pages/class-detail/CreateClass";
import { AddStudent } from "../pages/student/AddStudent";
import { ClassList } from "../pages/setting-page/ClassList";
import { SubjectList } from "../pages/setting-page/SubjectList";
import { SettingList } from "../pages/setting-page/SettingList";
import { UserList } from "../pages/setting-page/UserList";
import { SearchStudent } from "../pages/student/SearchStudent";
import SearchClassDetail from "../pages/class-detail/SearchClassDetail";
import { Score } from "../pages/score/Score";
import { CreateScore } from "../pages/score/CreateScore";
import { SearchScore } from "../pages/score/SearchScore";
import ScoreDetail from "../pages/score/ScoreDetail";
import { Report } from "../pages/report/Report";
import { ReportSubject } from "../pages/report/ReportSubject";
import { CreateReportSubject } from "../pages/report/create-report/CreateReportSubject";
import { ReportTerm } from "../pages/report/ReportTerm";
import { CreateReportTerm } from "../pages/report/create-report/CreateReportTerm";
import { SearchClass } from "../pages/class-detail/SearchClass";
import { StudentIntro } from "../pages/student/StudentIntro";
import { ClassIntro } from "../pages/class-detail/ClassIntro";
import { ScoreIntro } from "../pages/score/ScoreIntro";
import NotFound from "../pages/NotFound";
import Loginpage from "../pages/login/Loginpage";

import { Switch, Route } from "react-router-dom";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Homepage}></Route>
      <Route path="/login" exact component={Loginpage}></Route>
      //setting
      <Route path="/setting" exact component={Setting}></Route>
      <Route path="/setting/class-list" component={ClassList}></Route>
      <Route path="/setting/subject-list" component={SubjectList}></Route>
      <Route path="/setting/setting-list" component={SettingList}></Route>
      <Route path="/setting/user" component={UserList}></Route>
      //student
      <Route path="/student" exact component={StudentIntro}></Route>
      <Route path="/add/add-student" component={AddStudent}></Route>
      <Route path="/search-student" component={SearchStudent}></Route>
      //class
      <Route path="/class" exact component={ClassIntro}></Route>
      <Route path="/add/add-class" exact component={AddClass}></Route>
      <Route
        path="/add/add-class/:className/:grade/:schoolyear"
        component={CreateClass}></Route>
      <Route path="/search-class-detail" component={SearchClass}></Route>
      <Route path="/class-detail/:id" component={SearchClassDetail}></Route>
      //score
      <Route path="/score-intro" exact component={ScoreIntro}></Route>
      <Route path="/score" exact component={Score}></Route>
      <Route
        path="/score/:className/:subject/:term/:schoolYear"
        component={CreateScore}></Route>
      <Route path="/search-score" component={SearchScore}></Route>
      <Route
        path="/score-detail/:className/:subject/:term/:schoolYear"
        component={ScoreDetail}></Route>
      <Route path="/report" exact component={Report}></Route>
      <Route
        path="/report/report-subject"
        exact
        component={ReportSubject}></Route>
      <Route
        path="/report/report-subject/:subject/:term/:schoolYear"
        component={CreateReportSubject}></Route>
      <Route path="/report/report-term" exact component={ReportTerm}></Route>
      <Route
        path="/report/report-term/:term/:schoolYear"
        component={CreateReportTerm}></Route>
      <Route path="*" component={NotFound}></Route>
    </Switch>
  );
};
