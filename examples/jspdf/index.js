var json = {
  questions: [
    {
      name: "name",
      type: "text",
      title: "Please enter your name:",
      placeHolder: "Jon Snow",
      isRequired: true,
      titleLocation: "hidden"
    }
  ]
};
console.log("lalal");
debugger;
var survey = new Survey.Survey(json);
survey.data = {
  name: "SUPER"
};
var pdfDocument = survey.render();
