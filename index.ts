export type PhoneNormalized = {
  code: string
  value: string
  isMobile: boolean
  hasCode: boolean
}
const isMobile = (number: string): boolean => number[0] === '9'

const clear = (phone: string): string => phone.replace(/\D/g, '')

const normalize = (input: string, defaultCode: string = '', minLength: number = 8): PhoneNormalized => {
  let code = defaultCode
  let value = clear(input)

  if (value.length === 0) {
    throw new Error('Empty value')
  }

  if (value.length < minLength) {
    throw Error('Minimum length is ' + minLength)
  }

  if (value.length > 11) {
    value = value.substr(0, -11)
  }

  if (value.length > 9) {
    code = value.substr(0, 2)
    value = value.substr(2)
  }

  if (value.length === 8 && ['7', '8', '9'].indexOf(value[0])) {
    value = '9' + value
  }

  return {
    code,
    value,
    hasCode: code.length >= 2,
    isMobile: isMobile(value),
  }
}

/**
 * @param {string|PhoneNormalized} input
 */
const format = (input: string | PhoneNormalized): string => {
  const phoneData = typeof input === 'string' ? normalize(input) : input

  const prefixLen = phoneData.isMobile ? 5 : 4
  const pattern = `(\\d{4,${prefixLen}})(\\d{4})`
  const regex = new RegExp(pattern)
  let formated = ''

  if (phoneData.hasCode) {
    formated = `(${phoneData.code}) `
  }

  formated += phoneData.value.replace(regex, '$1-$2')
  return formated
}

const phoneFormater = {
  clear,
  normalize,
  isMobile,
  format,
}

export default phoneFormater
