export const getErrorMsg = (responseBody: any): string => {
  if (
    responseBody?.error?.message &&
    typeof responseBody.error.message === 'string'
  ) {
    if (responseBody.error.message === 'Refresh token no longer valid') {
      localStorage.clear()
      window.location.replace('/')
      return 'Please login'
    }
    if (responseBody.error.message === 'Authorization token no longer valid') {
      window.location.replace('/')
      return 'Session expired'
    }
    return responseBody.error.message
  }

  if (responseBody?.error?.message?.details[0]?.message) {
    return responseBody?.error?.message?.details[0]?.message
  }

  return 'Unhandled exception'
}
