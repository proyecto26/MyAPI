// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function EnumToArray(enumeration: any): string[] {
  return Object.keys(enumeration).map(key => enumeration[key])
}