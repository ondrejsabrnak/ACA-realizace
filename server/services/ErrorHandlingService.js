class ErrorHandlingService {
  static handleNotFound(res, entity, id) {
    return res.status(404).json({
      code: `${entity}NotFound`,
      message: `${entity} with id ${id} not found`
    });
  }

  static handleValidationError(res, errors) {
    return res.status(400).json({
      code: 'validationError',
      errors
    });
  }

  static handleBusinessError(res, code, message) {
    return res.status(400).json({
      code,
      message
    });
  }

  static handleServerError(res, error) {
    console.error(error);
    return res.status(500).json({
      code: 'serverError',
      message: error.message || 'Internal server error'
    });
  }
}

module.exports = ErrorHandlingService;