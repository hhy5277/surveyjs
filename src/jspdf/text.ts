import {
  Rect,
  QuestionRepository,
  PdfQuestionRenderer,
  ICoordinates
} from "./survey";
import { IQuestion } from "../base";
import { QuestionTextModel } from "../question_text";

export class TextQuestion extends PdfQuestionRenderer {
  constructor(question: IQuestion, doc: any) {
    super(question, doc);
  }
  getBoundaries(coordinates: ICoordinates): Rect {
    //TODO
    return null;
  }
  render(coordinates: ICoordinates) {
    var nextCoordinates = super.render(coordinates);
    var question: QuestionTextModel = this.getQuestion<QuestionTextModel>();
    var x = nextCoordinates.x + 10;
    var y = nextCoordinates.y + 20;
    var textField = new this.doc.AcroFormTextField();
    var width = question.width ? Number(question.width) : 150;
    textField.Rect = [x, y, width, 10];
    textField.fieldName = question.id;
    this.doc.addField(textField);
    return { x: nextCoordinates.x, y: y + 20 };
  }
}

QuestionRepository.instance.register("text", TextQuestion);
