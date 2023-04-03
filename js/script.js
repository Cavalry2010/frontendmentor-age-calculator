"use strict";

class AgeCalc {
  inputsBox = document.querySelector(".inputs-box");
  form = document.querySelector(".date-form");

  constructor() {
    this.currentDate = new Date();
    this.form.setAttribute("novalidate", "novalidate");
    this.form.addEventListener("submit", this.checkForm.bind(this));
  }

  checkForm(e) {
    e.preventDefault();
    const dateTemp = [];
    let validInputs = 0;

    const formChildren = Array.from(this.form.children);
    formChildren.forEach((child) => {
      const childElements = Array.from(child.children);
      childElements.forEach((el) => {
        if (el.tagName === "INPUT") {
          const input = el.value;
          const inputValue = Number(input);
          const placeholder = el.getAttribute("placeholder");
          if (input === "") {
            this.showError(child, "This field is required");
            return;
          }
          if (this.checkInput(inputValue, placeholder, child)) {
            dateTemp.push(inputValue);
            validInputs++;
            this.removeError(child);
          }
        }
      });
    });
    const dateFinal = dateTemp.join("-");
    if (validInputs === 3) {
      this.removeError("", true);
      if (moment(dateFinal, "DD/MM/YYYY").isValid()) {
        const results = this.getDateDifference(moment(dateFinal, "DD/MM/YYYY"));
        this.showResults(results);
      } else {
        this.showError(formChildren[0], "Must be a valid date", true);
      }
    }
  }

  checkInput(inputValue, placeholder, child) {
    const maxRange = placeholder === "DD" ? 31 : 12;
    const message =
      placeholder === "DD" ? "Must be a valid day" : "Must be a valid month";
    if (placeholder === "YYYY") {
      if (inputValue > this.currentDate.getFullYear()) {
        this.showError(child, "Must be in the past");
        return false;
      } else {
        return true;
      }
    }
    if (placeholder !== "YYYY" && inputValue >= 1 && inputValue <= maxRange) {
      return true;
    } else {
      this.showError(child, message);
      return false;
    }
  }

  getDateDifference(date) {
    const inputDate = date;
    const curDate = moment(this.currentDate);
    const difference = new Date(curDate.diff(inputDate));

    const differenceFormat = (
      difference.getDate() +
      "-" +
      (difference.getMonth() + 1) +
      "-" +
      difference.getFullYear()
    ).split("-");
    const daysPassed = Number(Math.abs(differenceFormat[0]));
    const monthsPassed = Number(Math.abs(differenceFormat[1]) - 1);
    const yearsPassed = Number(Math.abs(differenceFormat[2]) - 1970);

    return [daysPassed, monthsPassed, yearsPassed];
  }

  showError(child, message, whole) {
    const messageEl = Array.from(child.children)[2];
    messageEl.textContent = message;
    if (!whole) {
      child.classList.add("form-invalid");
      this.inputsBox.classList.add("error-padding");
    }
    if (whole) {
      this.inputsBox.classList.add("whole-error", "error-padding");
    }
  }

  removeError(child, whole) {
    if (!whole) {
      child.classList.remove("form-invalid");
    }
    if (whole) {
      this.inputsBox.classList.remove("error-padding", "whole-error");
    }
  }

  showResults(results) {
    const resultsFormat = results.reverse();
    document.querySelector(".num-year").textContent = resultsFormat[0];
    document.querySelector(".num-month").textContent = resultsFormat[1];
    document.querySelector(".num-day").textContent = resultsFormat[2];
  }
}

const ageCalculator = new AgeCalc();
