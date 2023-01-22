// validate-req middleware is used to validate data fields in request body
const validateRegisterRequestBody = (req, res, next) => {
  let { role, email, name, password, confirmPassword } = req.body

  // Check data type
  if (
    typeof role !== 'string' ||
    typeof email !== 'string' ||
    typeof name !== 'string' ||
    typeof password !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    return res.status(400).json({
      status: '400T',
      message:
        'Type: role, email, name, password, confirmPassword must be string.',
    })
  }

  // Remove white space in each string
  role = role.replace(/\s+/g, '')
  email = email.replace(/\s+/g, '')
  name = name.replace(/\s+/g, '')
  password = password.replace(/\s+/g, '')
  confirmPassword = confirmPassword.replace(/\s+/g, '')

  // Check if there is missing data
  if (!role || !email || !name || !password || !confirmPassword) {
    return res.status(400).json({
      status: '400F',
      message:
        'Field: role, email, name, password, confirmPassword are required.',
    })
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({
      status: '400L',
      message: 'Length: password length has to be more than 6 characters.',
    })
  }

  // Check if password and confirm password are matched
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: '400P',
      message: 'Password: password and confirmPassword are not matched.',
    })
  }

  // Role has to be one of three: TA, graduate, student
  if (role !== 'TA' && role !== 'graduate' && role !== 'student') {
    return res.status(400).json({
      status: '400R',
      message: `Role: role has to be one of these three: TA, graduate, student.`,
    })
  }

  if (role && email && name && password && confirmPassword) {
    return next()
  }
}

const validateLoginRequestBody = (req, res, next) => {
  let { email, password } = req.body

  // Check data type
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      status: '400T',
      message: 'Type: email and password must be string.',
    })
  }

  // Remove white space in each string
  email = email.replace(/\s+/g, '')
  password = password.replace(/\s+/g, '')

  // Check if there is missing data
  if (!email || !password) {
    return res.status(400).json({
      status: '400F',
      message: 'Field: email and password are required.',
    })
  }

  if (email && password) {
    return next()
  }
}

module.exports = {
  validateRegisterRequestBody,
  validateLoginRequestBody,
}
