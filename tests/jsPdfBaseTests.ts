import { JsPdfSurveyModel } from "../src/jspdf/survey";

export default QUnit.module("JsPDF");

QUnit.test("", function(assert) {
  var json = {
    questions: [
      {
        type: "text",
        name: "car",
        title: "What car are you driving?"
      },
      {
        type: "text",
        name: "car1",
        title: "What car are you driving?"
      },
      {
        type: "text",
        name: "car2",
        title: "What car are you driving?"
      }
    ]
  };

  var pdfSurvey = new JsPdfSurveyModel(json);

  // assert.deepEqual(q1.value, survey.data.image1);
  // assert.equal(q2.previewValue.length, 1, "file stored as text");
});
