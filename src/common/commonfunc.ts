// common.ts

export function parseDDMMYY(dateString: Date): Date {
  const day = parseInt(dateString.toString().slice(0, 2), 10)
  const month = parseInt(dateString.toString().slice(2, 4), 10) - 1 // Months are 0-based
  const year = parseInt(dateString.toString().slice(4, 6), 10) + 2000 // Assuming 21st century

  return new Date(year, month, day)
}
