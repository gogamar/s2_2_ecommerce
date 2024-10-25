function validate() {
  let error = 0;

  const fName = document.getElementById("fName");
  const fLastName = document.getElementById("fLastN");
  const fPhone = document.getElementById("fPhone");
  const fPassword = document.getElementById("fPassword");
  const fEmail = document.getElementById("fEmail");
  const fAddress = document.getElementById("fAddress");

  const errorName = document.getElementById("errorName");
  const errorLastN = document.getElementById("errorLastN");
  const errorPhone = document.getElementById("errorPhone");
  const errorPassword = document.getElementById("errorPassword");
  const errorEmail = document.getElementById("errorEmail");
  const errorAddress = document.getElementById("errorAddress");

  // Clear previous error messages and styles
  [fName, fLastName, fPhone, fPassword, fEmail, fAddress].forEach((field) => {
    field.classList.remove("is-invalid");
  });
  [errorName, errorLastN, errorPhone, errorPassword, errorEmail, errorAddress].forEach((error) => {
    error.textContent = "";
  });

  error += validateName(fName, errorName, "First name");

  error += validateName(fLastName, errorLastN, "Last name");

  if (fPhone.value.trim() === "" || !/^\d{9}$/.test(fPhone.value)) {
    error++;
    fPhone.classList.add("is-invalid");
    errorPhone.textContent = "Phone number must contain exactly 9 digits with no letters.";
  }

  if (fPassword.value.trim() === "" || fPassword.value.length < 4 || fPassword.value.length > 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(fPassword.value)) {
    error++;
    fPassword.classList.add("is-invalid");
    errorPassword.textContent = "Password must be 4-8 characters and include both letters and numbers.";
  }

  if (fEmail.value.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value)) {
    error++;
    fEmail.classList.add("is-invalid");
    errorEmail.textContent = "Email must be in a valid format.";
  }

  if (fAddress.value.trim() === "" || fAddress.value.length < 3) {
    error++;
    fAddress.classList.add("is-invalid");
    errorAddress.textContent = "Address must be at least 3 characters long.";
  }

  const form = document.querySelector("form");
  if (error > 0) {
    form.classList.add("was-validated");
  } else {
    form.submit();
  }
}

function validateName(field, errorElement, fieldName) {
  let errorIncrement = 0;

  if (field.value.trim() === "" || field.value.length < 3 || !/^[A-Za-z]+$/.test(field.value)) {
    errorIncrement++;
    field.classList.add("is-invalid");
    errorElement.textContent = `${fieldName} must have at least 3 characters and contain only letters.`;
  }
  return errorIncrement;
}
