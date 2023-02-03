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
      status: '400FT',
      message:
        'Field: role, email, name, password, confirmPassword must be string.',
    })
  }

  // Check if there is white space in email, password or confirmPassword
  if (
    email.includes(' ') ||
    password.includes(' ') ||
    confirmPassword.includes(' ')
  ) {
    return res.status(400).json({
      status: '400FS',
      message:
        'Field: white space is not allowed in email, password or confirmPassword.',
    })
  }

  // Remove white space in each string
  role = role.replace(/\s+/g, '')
  email = email.replace(/\s+/g, '')
  name = name.replace(/\s+/g, '')
  password = password.replace(/\s+/g, '')
  confirmPassword = confirmPassword.replace(/\s+/g, '')

  // Change email to lowercase
  email.toLowerCase()

  // Check if there is missing data
  if (!role || !email || !name || !password || !confirmPassword) {
    return res.status(400).json({
      status: '400FR',
      message:
        'Field: role, email, name, password, confirmPassword are required.',
    })
  }

  // Check name length
  if (name.length > 20) {
    return res.status(400).json({
      status: '400FL',
      message: 'Field: name length has to be less than 20 characters.',
    })
  }

  // Check password and confirmPassword length
  if (password.length < 8 || confirmPassword.length < 8) {
    return res.status(400).json({
      status: '400FL',
      message:
        'Field: password and confirmPassword length have to be more than 8 characters.',
    })
  }

  // Check if password and confirmPassword are matched
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: '400FM',
      message: 'Field: password and confirmPassword are not matched.',
    })
  }

  // Role has to be one of three: TA, graduate, student
  if (role !== 'TA' && role !== 'graduate' && role !== 'student') {
    return res.status(400).json({
      status: '400FR',
      message: `Field: role has to be one of these three: TA, graduate, student.`,
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
      status: '400FT',
      message: 'Field: email and password must be string.',
    })
  }

  // Check if there is white space in email or password
  if (email.includes(' ') || password.includes(' ')) {
    return res.status(400).json({
      status: '400FS',
      message: 'Field: white space is not allowed in email or password.',
    })
  }

  // Remove white space in each string
  email = email.replace(/\s+/g, '')
  password = password.replace(/\s+/g, '')

  // Change email to lowercase
  email.toLowerCase()

  // Check if there is missing data
  if (!email || !password) {
    return res.status(400).json({
      status: '400FR',
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
