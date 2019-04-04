import { IRect, QuestionRepository, ICoordinates } from "./survey";
import { PdfQuestionRendererBase } from "./survey";
import { IQuestion } from "../base";
import { QuestionTextModel } from "../question_text";

export class TextQuestion extends PdfQuestionRendererBase {
  constructor(question: IQuestion, doc: any) {
    super(question, doc);
  }
  getBoundariesContent(coordinates: ICoordinates): IRect {
    let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    // var width = question.width ? Number(question.width) : 150;
    let width = 50;
    let height = 10;
    return {
      xLeft: coordinates.xLeft,
      xRight: coordinates.xLeft + width,
      yTop: coordinates.yTop,
      yBot: coordinates.yTop + height
    };
  }
  renderContent(coordinates: ICoordinates) {
    let question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    let textField = new this.doc.AcroFormTextField();
    let boundaries: IRect = this.getBoundaries(coordinates);
    textField.Rect = [
      boundaries.xLeft,
      boundaries.yTop,
      boundaries.xRight - boundaries.xLeft,
      boundaries.yBot - boundaries.yTop
    ];
    textField.multiline = false;
    textField.value = question.value;
    textField.fieldName = question.id;
    this.doc.addField(textField);
  }
}

QuestionRepository.getInstance().register("text", TextQuestion);
