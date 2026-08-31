const departmentByCode = {
  '01': 'CIVIL',
  '02': 'EEE',
  '03': 'ME',
  '04': 'CSE',
  '05': 'MIE',
  '06': 'MME',
  '07': 'PME',
  '08': 'WRE',
  '09': 'BME',
  '10': 'ETE',
}

export function departmentFromStudentEmail(email) {
  const match = /^u\d{2}(\d{2})\d+@student\.cuet\.ac\.bd$/i.exec(email)
  return match ? departmentByCode[match[1]] ?? null : null
}

export { departmentByCode }
