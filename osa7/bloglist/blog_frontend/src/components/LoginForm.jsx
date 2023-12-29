import PropTypes from "prop-types"
import { Table, Form, Button } from 'react-bootstrap'
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <br />
        <Button id="login-button" type="submit">
          login
        </Button>
      </Form>
      <br />
    </div>
  )
}

LoginForm.propType = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
