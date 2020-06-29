import { times, isString, trim } from 'lodash'

type Model = {
  name: string
}

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const lowerCaseFirstLetter = (text: string): string => {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

/**
 * Get table name of a model
 * @param model - Model of the table
 */
export const getTableName = (model: Model): string => {
  return `${model.name}`.toLowerCase()
}

/**
 * Get the sequence of the params for database queries
 * @param paramLength - Number of params
 */
export const getParamValues = (paramLength: number): string => {
  return times(paramLength, i => `$${ i + 1 }`).join(',')
}

/**
 * Trim the string props of an object
 * @param object - An object with string props.
 */
export function trimStringProps<T> (object: T): T {
  const newObject = JSON.parse(JSON.stringify(object)) as T
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = object[key]
      newObject[key] = (isString(value) ? trim(value) : value ) as any
    }
  }
  return newObject
}

/**
 * Convert to JSON if the prop is a string
 * @param property - A property of an object.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function stringToJSON (property: any): any {
  if (typeof property === 'string') {
    return JSON.parse(property)
  }
  return property
}
