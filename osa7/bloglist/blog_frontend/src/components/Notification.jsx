import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  let style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: "10px",
  }

  if (notification.type === "success") {
    style = {
      ...style,
      color: "green",
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
      marginBottom: "10px",
    }
  } else {
    style = {
      ...style,
      color: "red",
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
    }
  }

  return notification.message ? (
    <div style={style}>{notification.message}</div>
  ) : null
}

export default Notification

/*
const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const errorType = isError ? "errorMessage" : "successMessage"
  return <div className={errorType}>{message}</div>
}
*/
