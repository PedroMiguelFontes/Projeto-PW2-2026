const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!regex.test(dateString)) {
        return false;
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return false;
    }

    return date.toISOString().slice(0, 10) === dateString;
};

module.exports=isValidDateFormat