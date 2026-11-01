/* =========================================================
   BrightNest Cleaning Co. - script.js
   Two jobs: (1) mobile menu, (2) demo form validation.
   ========================================================= */

/* ---------- 1. Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

function setMenu(isOpen) {
  // classList.toggle adds or removes the "is-open" class (CSS shows or hides the menu)
  siteNav.classList.toggle("is-open", isOpen);
  // aria-expanded tells screen readers whether the menu is open
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", function () {
  setMenu(!siteNav.classList.contains("is-open"));
});

// Close the menu after tapping any link inside it
siteNav.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    setMenu(false);
  }
});

// Close the menu with the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

/* ---------- 2. Demo quote form ---------- */
const form = document.getElementById("quote-form");
const formResult = document.getElementById("form-result");
const dateInput = document.getElementById("date");

// Do not allow dates in the past. Format must be YYYY-MM-DD.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
dateInput.min = localToday;

// Each rule returns an error message, or "" when the value is fine.
const rules = {
  name: function (value) {
    return value.trim().length >= 2 ? "" : "Please enter your full name.";
  },
  email: function (value) {
    // A simple pattern: something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ""
      : "Please enter a valid email, like name@example.com.";
  },
  phone: function (value) {
    const digits = value.replace(/\D/g, ""); // keep digits only
    const validCharacters = /^[0-9+\-()\s]+$/.test(value.trim());
    return validCharacters && digits.length >= 7 && digits.length <= 15
      ? ""
      : "Please enter a phone number with 7 to 15 digits.";
  },
  service: function (value) {
    return value ? "" : "Please choose a service.";
  },
  date: function (value) {
    if (!value) return "Please choose a preferred date.";
    return value >= localToday ? "" : "Please choose today or a future date.";
  },
  size: function (value) {
    return value ? "" : "Please choose a property size.";
  }
};

// Show or clear the error message for one field
function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(fieldName + "-error");
  input.closest(".form-field").classList.toggle("has-error", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  errorElement.textContent = message;
}

// Check one field. Returns true if it is valid.
function validateField(fieldName) {
  const value = document.getElementById(fieldName).value;
  const message = rules[fieldName](value);
  showFieldError(fieldName, message);
  return message === "";
}

// Re-check a field as soon as the person leaves it
Object.keys(rules).forEach(function (fieldName) {
  document.getElementById(fieldName).addEventListener("blur", function () {
    validateField(fieldName);
  });
});

form.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page. This demo has no server.
  event.preventDefault();
  formResult.hidden = true;

  let firstInvalid = null;
  Object.keys(rules).forEach(function (fieldName) {
    const isValid = validateField(fieldName);
    if (!isValid && firstInvalid === null) {
      firstInvalid = document.getElementById(fieldName);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus(); // move the cursor to the first problem
    return;
  }

  // Everything is valid. We only show a message; nothing is sent or saved.
  formResult.innerHTML =
    "<p><strong>This is a demo form.</strong> Your details were checked in your browser only. " +
    "No booking was submitted, and no email was sent.</p>";
  formResult.hidden = false;
  form.reset();
  Object.keys(rules).forEach(function (fieldName) {
    showFieldError(fieldName, "");
  });
});
