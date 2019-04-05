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
      type: "radiogroup",
      name: "radio",
      title: "What radio you are like?",
      isRequired: true,
      choices: [
          "Radio City",
          "Big FM",
          "Red FM",
          "Radio Mirchi"
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
      title: "What car are YOU driving?",
      isRequired: true,
      choices: [
          "A",
          "B",
          "EEE",
          "UU",
      ],
      titleLocation: "left"
    },
    {
      type: "checkbox",
      name: "car3",
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
    }
  ]
};

var survey = new Survey.Survey(json);
survey.data = {
  car: ["Ford"],
  name: "SUPER",
  name2: "DATA",
  car2: ["A", "EEE"],
  radio: "Red FM"
}
// var pdfDocument = survey.render(16, 0.165, 0.36);
var pdfDocument = survey.render(15, 0.22, 0.36);
