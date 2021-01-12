import React, {useState, useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import DashboardIcon from '@material-ui/icons/Dashboard';
import CachedIcon from '@material-ui/icons/Cached';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import FaceIcon from '@material-ui/icons/Face';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import WorkshopsTable from '../../components/WorkshopsTable';
import UsersTable from '../../components/UsersTable';

import HappinessLogo from "../../images/happiness-h-logo.png";

import '../../style/dashboard.scss';

const drawerWidth = 240;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // necessary for content to be below app bar
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();

  const [location, setLocation] = React.useState("dashboard");
  const [isLoading] = useState(true);
  const [userList] = React.useState(null);
  const [workshopList] = React.useState(null);

  const queryData = () => {
    // TODO: Get Workshop Data
  };

  useEffect(() => {
    queryData();
  }, []);

  const handlePageChange = (location) => {
    setLocation(location);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
      >
      <div className="logo-icon">
        <img src={HappinessLogo} alt="The Happiness Planner Logo"/>
      </div>
        <List>
          <ListItem button key={"dash-i"} onClick={() => handlePageChange('dashboard')} className={`list-icon ${location === "dashboard"? "selected-menu": ""}`}>
            <ListItemIcon><DashboardIcon/></ListItemIcon>
          </ListItem>
          <ListItem button key={"workshops-i"} onClick={() => handlePageChange('workshops')} className={`list-icon ${location === "workshops"? "selected-menu workshops": ""}`}>
            <ListItemIcon><DirectionsWalkIcon/></ListItemIcon>
          </ListItem>
          <ListItem button key={"users-i"} onClick={() => handlePageChange('users')} className={`list-icon ${location === "users"? "selected-menu users": ""}`}>
            <ListItemIcon><FaceIcon/></ListItemIcon>
          </ListItem>
          <ListItem button onClick={props.exitApp} key={"signout-i"} className="list-icon" >
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
          </ListItem>
        </List>
      </Drawer>

      <main className={classes.content}>

        <div className={`page-header ${
              location === "dashboard"? "dashboard":
              location === "users"? "users":
              location === "workshops"? "workshops":null
          }`}>
          <h2>
            {
              location === "dashboard"? "dashboard":
              location === "users"? "users":
              location === "workshops"? "workshops":null
            }
          </h2>
          <div className="page-actions">
            <Button
              variant="contained"
              color="primary"
              className="tm-button"
              onClick={queryData}
              disabled={isLoading? true: false}
              startIcon={<CachedIcon />}
            >
              Refresh
            </Button>
          </div>
        </div>


        {isLoading?
          <div className="loading-block">
            <div className="loading-container">
              <CircularProgress />
            </div>
          </div>
        :
      <>
        {
          location === "dashboard"? <>
            <div className="dash-data">
            <Button className="count-icon workshops" onClick={() => handlePageChange('workshops')}>
              <h1>{numberWithCommas(workshopList.length)}</h1>
              <h3>Workshops</h3>
            </Button>
            <Button className="count-icon users" onClick={() => handlePageChange('users')}>
              <h1>{numberWithCommas(userList.length)}</h1>
              <h3>All Users</h3>
            </Button>
            </div>
          </>:
          location === "users"? <>
            <div className="table-holder">
              <UsersTable userList={userList} geocore={props.geocore} queryData={queryData} />
            </div>
          </>:
          location === "workshops"? <>
            <div className="table-holder">
              <WorkshopsTable workshopList={workshopList} geocore={props.geocore} queryData={queryData} />
            </div>
          </>:null
        }
      </>}
      </main>
    </div>
  );
}