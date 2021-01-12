import React from "react";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

import "../styles/alerts.scss";

class AlertSnackbar extends React.Component {
  render() {
    const icon =
      this.props.isType === "error" ||
      this.props.isType === "connection-error" ? (
        <ErrorOutline
          key="error"
          className={this.props.isType + "-icon-snackbar"}
        />
      ) : (
        <CheckCircleOutline
          key="success"
          className={this.props.isType + "-icon-snackbar"}
        />
      );

    return (
      <div>
        <Snackbar
          className={this.props.isType + "-snackbar-alert-wrap snackbar-main-wrapper"}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={this.props.isOpen}
          autoHideDuration={3000}
          ContentProps={{
            "aria-describedby": "alert-message-content",
          }}
          message={
            <span
              id="alert-message-content"
              className={this.props.isType + "-alert-message"}
            >
              {this.props.message}
            </span>
          }
          action={[
            icon,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={this.props.isType + "-snackbar-button"}
              onClick={this.props.handleClick}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default AlertSnackbar;
