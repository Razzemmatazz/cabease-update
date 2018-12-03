var forms = {
  "Add Fare": {
    questions: [
      {
        name: "confirmation",
        label: "Confirmation #",
        type: "input",
        subtype: "text",
        options: []
      },
      {
        name: "fareAmt",
        label: "Fare Amount",
        type: "input",
        subtype: "number",
        step: "0.01",
        placeholder: "$",
        options: [],
        focusout: "verifyAmt(this)"
      },
      {
        name: "fareType",
        label: "Fare Type",
        type: "btn-group",
        subtype: "vertical",
        options: [
          "Cash",
          "Account",
          "Credit Card",
          "TARPS (Cash Only)",
          "Personal",
          "Out of State Cash",
          "Owner Fleet"
        ],
        click: "buttonCheck(this)"
      },
      {
        name: "fareDiscrepancy",
        label: "Was there a Fare Discrepancy?",
        type: "btn-group",
        subtype: "",
        options: ["Yes", "No"],
        click: "buttonCheck(this)"
      }
    ],
    submit: {
      id: "addFareSubmit",
      html: "Submit",
      type: "submit",
      onclick: "submit('addFareForm')"
    }
  },
  "Add Expense/Gas": {
    questions: [
      {
        name: "expenseAmount",
        label: "Amount of Expense/Gas",
        type: "input",
        subtype: "number",
        step: "0.01",
        placeholder: "$",
        options: [],
        focusout: "verifyAmt(this)"
      },
      {
        name: "expenseType",
        label: "Type of Expense",
        type: "btn-group",
        subtype: "",
        options: ["Gas", "Expense"],
        click: "buttonCheck(this)"
      }
    ],
    submit: {
      id: "addExpenseSubmit",
      html: "Submit",
      type: "submit",
      onclick: "submit('addExpenseForm')"
    }
  },
  logOn: {
    questions: [
      {
        name: "vehicleNum",
        label: "Vehicle #",
        type: "input",
        subtype: "number",
        options: [],
        click: ""
      },
      {
        name: "odometer",
        label: "Odometer",
        type: "input",
        subtype: "number",
        options: [],
        click: ""
      }
    ],
    submit: {
      id: "logOnOff",
      html: "Log On",
      type: "submit",
      onclick: "submit('logOnForm')"
    }
  },
  logOff: {
    questions: [
      {
        name: "vehicleNum",
        label: "Vehicle #",
        type: "input",
        subtype: "number",
        options: [],
        click: ""
      },
      {
        name: "odometer",
        label: "Odometer",
        type: "input",
        subtype: "number",
        options: [],
        click: ""
      }
    ],
    submit: {
      name: "logOnOff",
      html: "Log Off",
      type: "submit",
      onclick: "submit('logOnForm')"
    }
  }
};
