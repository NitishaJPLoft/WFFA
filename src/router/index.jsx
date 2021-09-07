import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Loader from '@material-ui/core/CircularProgress';
import ApplicationDashboard from '../pages/dashboard/ApplicationDashbord';
import JudgeDashboard from '../pages/dashboard/JudgeDashbord';
import SystemAdminAppDetails from '../pages/system/SystemAdminAppDetails';
import SystemAdminApps from '../pages/system/SystemAdminApps';
import SystemAdminDashboard from '../pages/system/SystemAdminDashboard';
import UserProfile from '../pages/user/UserProfile';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import NotFound from '../pages/errors/NotFound';
import UserList from '../pages/system/users';
import EditApp from '../pages/system/apps/Edit';
import CreateApp from '../pages/system/apps/Create';
import ResetPassword from '../pages/auth/ResetPassword';
import Tournaments from '../pages/tournaments/Tournaments';
import TournamentDetails from '../pages/tournaments/TournamentDetails';
import BattleTreeViewPublic from '../pages/tournaments/BattleTreeViewPublic';
import JudgingList from '../pages/judging/JudgingList';

import CreateTournament from '../pages/tournaments/CreateTournament';
import CreateStage from '../pages/tournaments/CreateStage';
import Sync from '../pages/system/users/Sync';
import UpdateVideo from '../pages/system/users/UpdateVideo/UpdateVideo';
import Stages from '../pages/landing/Stages';
import ShowVideoList from '../pages/system/users/ShowVideoList';
import UpdateSkillBattleVideo from "../pages/system/users/UpdateVideo/UpdateSkillBattleVideo";

const Router = () => {
  const redirectPath = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    return roleId === 2
      ? '/application-dashboard'
      : roleId === 3
      ? '/organisation-dashboard'
      : roleId === 4
      ? '/judge-dashboard'
      : '/system-dashboard';
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route
            path="/login"
            exact
            render={() =>
              localStorage.getItem('token') ? (
                <Redirect to={redirectPath()} />
              ) : (
                <Login />
              )
            }
          />

          <Route exact path="/forgot-password" component={ForgotPassword} />

          <Route exact path="/reset-password" component={ResetPassword} />

          <Route
            exact
            path="/battle-public/:sId"
            component={BattleTreeViewPublic}
          />

<Route
            exact
            path="/pool-public/:sId"
            component={BattleTreeViewPublic}
          />

          <PrivateRoute
            exact
            path="/application-dashboard"
            component={ApplicationDashboard}
          />
          <PrivateRoute
            exact
            path="/organisation-dashboard"
            component={ApplicationDashboard}
          />
          <PrivateRoute
            exact
            path="/judge-dashboard"
            component={JudgeDashboard}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/app/create"
            component={CreateApp}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/app/:appID"
            component={SystemAdminAppDetails}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/app/edit/:appID"
            component={EditApp}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/app"
            component={SystemAdminApps}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/users"
            component={UserList}
          />
          <PrivateRoute
            exact
            path="/application-dashboard/users"
            component={UserList}
          />

          <PrivateRoute exact path="/tournament/:id" component={Stages} />

          <PrivateRoute
            exact
            path="/organisation-dashboard/users"
            component={UserList}
          />
          <PrivateRoute
            exact
            path="/application-dashboard/tournaments"
            component={Tournaments}
          />
          <PrivateRoute
            exact
            path="/organisation-dashboard/tournaments"
            component={Tournaments}
          />
          <PrivateRoute
            exact
            path="/application-dashboard/tournaments/:id"
            component={TournamentDetails}
          />
          <PrivateRoute
            exact
            path="/organisation-dashboard/tournaments/:id"
            component={TournamentDetails}
          />
          <PrivateRoute
            exact
            path="/application-dashboard/tournament/create"
            component={CreateTournament}
          />

          <PrivateRoute
            exact
            path="/organisation-dashboard/tournament/edit/:id"
            component={CreateTournament}
          />

          <PrivateRoute
            exact
            path="/application-dashboard/tournament/edit/:id"
            component={CreateTournament}
          />

          <PrivateRoute
            exact
            path="/organisation-dashboard/tournament/create"
            component={CreateTournament}
          />

          <PrivateRoute
            exact
            path="/application-dashboard/tournament/:id/stage/create"
            component={CreateStage}
          />

          <PrivateRoute
            exact
            path="/organisation-dashboard/tournament/:id/stage/create"
            component={CreateStage}
          />

          <PrivateRoute
            exact
            path="/organisation-dashboard/tournament/:id/stage/:stageId"
            component={CreateStage}
          />

          <PrivateRoute
            exact
            path="/application-dashboard/tournament/:id/stage/:stageId"
            component={CreateStage}
          />

          <PrivateRoute
            exact
            path="/application-dashboard/judging"
            component={JudgingList}
          />
          <PrivateRoute
            exact
            path="/organisation-dashboard/judging"
            component={JudgingList}
          />

          <PrivateRoute
            exact
            path="/system-dashboard"
            component={SystemAdminDashboard}
          />
          <PrivateRoute exact path="/system-dashboard/sync" component={Sync} />
          <PrivateRoute exact path="/system-dashboard/sync/update" component={UpdateVideo} />
          <PrivateRoute
            exact
            path="/system-dashboard/videos/compilation-progress"
            component={UpdateSkillBattleVideo}
          />
          <PrivateRoute
            exact
            path="/system-dashboard/videos/:type"
            component={ShowVideoList}
          />

          <PrivateRoute exact path="/user-profile" component={UserProfile} />

          <PrivateRoute exact path="/">
            <Redirect
              to={localStorage.getItem('token') ? redirectPath() : '/login'}
            />
          </PrivateRoute>

          <PrivateRoute
            exact
            path="/dashboard"
            component={SystemAdminDashboard}
          />
          <Route component={NotFound} />

          <Route exact path="/404" component={NotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
