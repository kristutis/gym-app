export const getErrorMsg = (responseBody: any): string => {
  if (
    responseBody?.error?.message &&
    typeof responseBody.error.message === 'string'
  ) {
    if (responseBody.error.message === 'Authorization token no longer valid') {
      window.location.replace('/')
      localStorage.clear()
      return 'Please login'
    }
    return responseBody.error.message
  }

  if (responseBody?.error?.message?.details[0]?.message) {
    return responseBody?.error?.message?.details[0]?.message
  }

  return 'Unhandled exception'
}
