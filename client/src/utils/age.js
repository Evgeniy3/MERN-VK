const age = (bt) => {
    var birthdayDate = new Date(bt);
    var currentDate = new Date();

    var age = currentDate.getFullYear() - birthdayDate.getFullYear();

    if (
      currentDate.getMonth() < birthdayDate.getMonth() ||
      (currentDate.getMonth() === birthdayDate.getMonth() &&
        currentDate.getDate() < birthdayDate.getDate())
    ) {
      age--;
    }
    return age;
}

export default age;