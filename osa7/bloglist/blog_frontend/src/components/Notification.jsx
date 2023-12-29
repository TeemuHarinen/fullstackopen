import { useSelector } from "react-redux"
import { Alert } from "react-bootstrap"
const Notification = () => {
  const notification = useSelector((state) => state.notification)

  return notification.message ? (
    <Alert variant={notification.type}>{notification.message}</Alert>
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
