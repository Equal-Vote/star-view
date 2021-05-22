import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import MainLayout from "./STAR/MainLayout";
import StarView from "./STAR/StarView";
import StarLoader from "./STAR/StarLoader";
import SheetLoader from "./STAR/SheetLoader";
import StarVote from "./STAR/StarVote";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Switch>
          <Route exact path="/" component={StarView} />
          <Route exact path="/star/:poll" component={StarLoader} />
          <Route exact path="/view/:election/:race" component={SheetLoader} />
          <Route exact path="/vote/:election/:race" component={StarVote} />
          <Redirect from="*" to="/" />
        </Switch>
      </MainLayout>
    </BrowserRouter>
  );
}
