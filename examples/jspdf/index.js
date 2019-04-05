var json = {
  questions: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      choices: [
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
      ],
      titleLocation: "top"
    },
    {
      name: "name",
      type: "text",
      title: "Please enter your name:",
      isRequired: true
    },
    {
      name: "name2",
      type: "text",
      title: "Rarrararar:",
      isRequired: true,
      titleLocation: "left"
    },
    {
      type: "checkbox",
      name: "car2",
      title: "What car are you driving?",
      isRequired: true,
      choices: [
          "A",
          "B",
          "EEE",
          "UU",
      ],
      titleLocation: "left"
    },
  ]
};
var survey = new Survey.Survey(json);
survey.data = {
  car: ["Ford"],
  name: "SUPER",
  name2: "DATA",
  car2: ["A", "EEE"]
};
// var pdfDocument = survey.render(16, 0.165, 0.36);
var pdfDocument = survey.render(16, 0.22, 0.36);
