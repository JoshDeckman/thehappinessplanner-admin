import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import DashboardIcon from "@material-ui/icons/Dashboard";
// import CachedIcon from "@material-ui/icons/Cached";
// import FaceIcon from "@material-ui/icons/Face";
import TrashIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddIcon from '@material-ui/icons/Add';
import TagIcon from '@material-ui/icons/LoyaltyOutlined';

import WorkshopsTable from "../../components/WorkshopsTable";
import RemovedWorkshopsTable from "../../components/RemovedWorkshopsTable";
// import UsersTable from "../../components/UsersTable";

import HappinessLogo from "../../images/happiness-h-logo.png";
import WorkshopLogo from "../../images/laptop-w.svg";

import "../../styles/dashboard.scss";
import TagsTable from "../../components/TagsTable";

const drawerWidth = 240;

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // necessary for content to be below app bar
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Dashboard({ firebase, exitApp, handleError, error, handleRequiredError, requiredError }) {
  const classes = useStyles();

  const [location, setLocation] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  // const [userList, setUserList] = useState(null);
  const [workshopList, setWorkshopList] = useState(null);
  const [removedWorkshopList, setRemovedWorkshopList] = useState(null);
  const [addWorkshopOpen, setAddWorkshopOpen] = useState(null);
  const [addTagOpen, setAddTagOpen] = useState(null);
  const [happinessTags, setHappinessTags] = useState(null);
  
  useEffect(() => {
    getWorkshopData();
    // getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWorkshopData = () => {
    console.log("Fetching Workshop data...");
    firebase.database().ref(`/workshops/`).on("value", (workshopSnap) => {
      if (workshopSnap.val() != null) {
        const workshopData = workshopSnap.val();
        const workshopKeys = Object.keys(workshopData);
        const workshopList = Object.values(workshopData);

        getWorkshopPhotos(workshopKeys, workshopList).then((workshopURLs) => {
          if (workshopURLs && workshopURLs.length > 0) {
            console.log("Fetching Tag data...");
            firebase.database().ref(`/tags/`).on("value", (tagSnap) => {
              if (tagSnap.val() != null) {
                const tagData = tagSnap.val();

                const removedWorkshopList = [];
                const displayedWorkshopList = [];
                
                workshopList.forEach((event, index) => {
                  let workshopTagList = [];

                  event.id = workshopKeys[index];
                  event.shortInfo = truncate(event.text);
                  event.imageURL = workshopURLs[index];
        
                  // Attach Tags to Workshop Event
                  Object.values(tagData).forEach((tagObj, index) => {
                    const tagWorkshopData = tagObj["workshops"];

                    if (tagWorkshopData && Object.keys(tagWorkshopData).includes(event.id)) {
                      workshopTagList.push(Object.keys(tagData)[index]);
                    }
                  });

                  event.tags = workshopTagList;

                  if (event.removed === "true") {
                    removedWorkshopList.push(event);
                  } else {
                    displayedWorkshopList.push(event);
                  }
                });

                setHappinessTags(tagData);
                setRemovedWorkshopList(removedWorkshopList);
                setWorkshopList(displayedWorkshopList);
                setIsLoading(false);
              } else {
                setIsLoading(false);
                handleError("An error occured. Please refresh and try again.");
              }
            });
          } else {
            setWorkshopList([]);
            setIsLoading(false);
            handleError("There was an error with the workshop photos. Please refresh and try again.");
          }
        });
      } else {
        setIsLoading(false);
        handleError("An error occured. Please refresh and try again.");
      }
    });
  };


  const getWorkshopPhotos = async (workshopKeys, workshopList) => {
    const workshopURLPromises = [];
    workshopList.forEach((event, index) => {
      let storageWorkshopRef =  firebase.storage().ref(`/workshops/`).child(
        `${workshopKeys[index]}/image.jpg`
      );
      workshopURLPromises.push(storageWorkshopRef.getDownloadURL());
    });

    const workshopURLs = await Promise.all(workshopURLPromises);

    return workshopURLs;
  };

  // const getUserData = () => {
  //   console.log("Fetching User data...");
  //   firebase.database().ref(`/access-level/`)
  //     .on("value", (snapshot) => {
  //       if (snapshot.val() != null) {
  //         const accessLevelData = snapshot.val();
          
  //         const accessLevelUserIds = Object.keys(accessLevelData);

  //         let adminUserList = [];

  //         accessLevelUserIds.forEach(userId => {
  //           if (accessLevelData[userId].admin) {
  //             adminUserList.push({ id: userId, accessLevel: "admin" });
  //           }
  //         });

  //         setUserList(adminUserList);
  //       }
  //     });
  // };

  const handlePageChange = (location) => {
    setLocation(location);
  };

  const truncate = (input) => {
    const parsedInput = input.replace("\n\n", " ");
    return parsedInput.substring(0, 90).replace(/[^a-zA-Z.'" ]/g, "") + "...";
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer variant="permanent">
        <div className="logo-icon">
          <img src={HappinessLogo} alt="The Happiness Planner Logo" />
        </div>
        <List>
          <ListItem
            button
            key={"dash-i"}
            onClick={() => handlePageChange("dashboard")}
            className={`list-icon ${
              location === "dashboard" ? "selected-menu" : ""
            }`}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            key={"workshops-i"}
            onClick={() => handlePageChange("workshops")}
            className={`list-icon ${
              location === "workshops" ? "selected-menu workshops" : ""
            }`}
          >
            <ListItemIcon>
              <img
                src={WorkshopLogo}
                alt="Workshop Logo"
                width="25"
                height="25"
              />
            </ListItemIcon>
          </ListItem>
          {/* <ListItem
            button
            key={"users-i"}
            onClick={() => handlePageChange("users")}
            className={`list-icon ${
              location === "users" ? "selected-menu users" : ""
            }`}
          >
            <ListItemIcon>
              <FaceIcon />
            </ListItemIcon>
          </ListItem> */}
          <ListItem
            button
            key={"tags-i"}
            onClick={() => handlePageChange("tags")}
            className={`list-icon ${
              location === "tags" ? "selected-menu tags" : ""
            }`}
          >
            <ListItemIcon>
              <TagIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            key={"users-i"}
            onClick={() => handlePageChange("removed-workshops")}
            className={`list-icon ${
              location === "removed-workshops" ? "selected-menu removed-workshops" : ""
            }`}
          >
            <ListItemIcon>
              <TrashIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={exitApp}
            key={"signout-i"}
            className="list-icon"
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>

      <main className={classes.content}>
        <div
          className={`page-header ${
            location === "dashboard"
              ? "dashboard"
              : location === "users"
              ? "users"
              : location === "workshops"
              ? "workshops"
              : location === "removed-workshops"
              ? "Removed Workshops"
              : location === "tags"
              ? "tags"
              : null
          }`}
        >
          <h2>
            {location === "dashboard"
              ? "dashboard"
              : location === "users"
              ? "users"
              : location === "workshops"
              ? "workshops"
              : location === "removed-workshops"
              ? "removed workshops"
              : location === "tags"
              ? "tags"
              : null}
          </h2>
          {location === "workshops" ? (
            <div className="page-actions">
              <Button
                variant="contained"
                className="workshop-add-btn"
                disabled={isLoading ? true : false}
                onClick={() => setAddWorkshopOpen(true)}
                startIcon={<AddIcon />}
              >
                Add Workshop
              </Button>
            </div>
          ) : null}
          {location === "tags" ? (
            <div className="page-actions">
              <Button
                variant="contained"
                className="tag-add-btn"
                disabled={isLoading ? true : false}
                onClick={() => setAddTagOpen(true)}
                startIcon={<AddIcon />}
              >
                Add Tag
              </Button>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="loading-block">
            <div className="loading-container">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <>
            {location === "dashboard" ? (
              <>
                <div className="dash-data">
                  <Button
                    className="count-icon workshops"
                    onClick={() => handlePageChange("workshops")}
                  >
                    <h1>{numberWithCommas(workshopList.length)}</h1>
                    <h3>Workshops</h3>
                  </Button>
                  {/* <Button
                    className="count-icon users"
                    onClick={() => handlePageChange("users")}
                  >
                    <h1>{numberWithCommas(userList.length)}</h1>
                    <h3>All Users</h3>
                  </Button> */}
                  <Button
                    className="count-icon users"
                    onClick={() => handlePageChange("removed-workshops")}
                  >
                    <h1>{numberWithCommas(removedWorkshopList.length)}</h1>
                    <h3>Removed Workshops</h3>
                  </Button>
                  <Button
                    className="count-icon tags"
                    onClick={() => handlePageChange("tags")}
                  >
                    <h1>{numberWithCommas(Object.keys(happinessTags).length)}</h1>
                    <h3>Tags</h3>
                  </Button>
                </div>
              </>
            ) : location === "users" ? (
              <>
                {/* <div className="table-holder">
                  <UsersTable userList={userList} />
                </div> */}
              </>
            ) : location === "workshops" ? (
              <>
                <div className="table-holder">
                  <WorkshopsTable
                    workshopList={workshopList}
                    error={error}
                    handleError={handleError}
                    requiredError={requiredError}
                    handleRequiredError={handleRequiredError}
                    firebase={firebase}
                    truncate={truncate}
                    addWorkshopOpen={addWorkshopOpen}
                    setAddWorkshopOpen={setAddWorkshopOpen}
                    happinessTags={happinessTags}
                  />
                </div>
              </>
            ) : location === "removed-workshops" ? (
              <>
                <div className="table-holder">
                  <RemovedWorkshopsTable
                    workshopList={removedWorkshopList}
                    handleError={handleError}
                    firebase={firebase}
                    truncate={truncate}
                    error={error}
                  />
                </div>
              </>
            ) : location === "tags" ? (
              <>
                <div className="table-holder">
                  <TagsTable
                    tagList={happinessTags}
                    workshopList={workshopList}
                    handleError={handleError}
                    firebase={firebase}
                    requiredError={requiredError}
                    handleRequiredError={handleRequiredError}
                    addTagOpen={addTagOpen}
                    setAddTagOpen={setAddTagOpen}
                  />
                </div>
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
