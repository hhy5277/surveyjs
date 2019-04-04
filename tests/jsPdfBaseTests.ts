import { TextQuestion } from "../src/jspdf/text";
import { JsPdfSurveyModel, PdfQuestionRendererBase } from "../src/jspdf/survey";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/entries/pdf";
import jsPDF from "jspdf";

export default QUnit.module("JsPDF");

QUnit.test("", function(assert) {
  let coordinates = { xLeft: 1, yTop: 1 };
  let assumedBoundaries = {
    xLeft: coordinates.xLeft,
    xRight: coordinates.xLeft,
    yTop: coordinates.yTop,
    yBot: coordinates.yTop
  };
  let resultBoundaries = new PdfQuestionRendererBase(
    new Question("q1"),
    new jsPDF()
  ).getBoundariesContent(coordinates);

  assert.deepEqual(
    assumedBoundaries,
    resultBoundaries,
    "PdfQuestionRendererBase.getBoundariesContent return not same boundaries"
  );
});
