export function isUnder18(dateString: string) {
    const birthDate = new Date(`${dateString}T00:00:00`)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const birthdayHasPassed = today.getMonth() > birthDate.getMonth()
        || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    if (!birthdayHasPassed) age -= 1
    return age < 18
}
