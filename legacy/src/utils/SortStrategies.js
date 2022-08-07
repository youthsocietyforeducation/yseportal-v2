export const sortByDate = (d1, d2) => {
    let date1 = Date.parse(d1); 
    let date2 = Date.parse(d2); 

    if (isNaN(date1) || isNaN(date1)) {
        if (isNaN(date1)) return 1
        if (isNaN(date2)) return -1
        return 0
    }
    return date2 - date1; 
}

export const sortByText = (t1, t2) => {
    return t1.localeCompare(t2); 
}

export const sortByNumber = (n1, n2) => {
    let number1 = Number.parse(n1); 
    let number2 = Number.parse(n2); 
    if (isNaN(number1) || isNaN(number2)) {
        if (isNaN(number1)) return 1
        if (isNaN(number2)) return -1
        return 0
    }
    return n1-n2; 
}