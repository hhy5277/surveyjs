// import {
//   Rect,
//   QuestionRepository,
//   ICoordinates
// } from "./survey";
// import { PdfQuestionRenderer } from "./PdfQuestionRenderer";
// import { IQuestion } from "../base";
// import { QuestionCheckboxModel } from "../question_checkbox";
// import { ItemValue } from "../itemvalue";

// export class CheckBoxQuestion extends PdfQuestionRenderer {
//   constructor(question: IQuestion, doc: any) {
//     super(question, doc);
//   }
//   getBoundaries(coordinates: ICoordinates): Rect {
//     //TODO
//     return null;
//   }
//   render(coordinates: ICoordinates) {
//     var nextCoordinates = super.render(coordinates);
//     var question: QuestionCheckboxModel = this.getQuestion<
//       QuestionCheckboxModel
//     >();
//     var x = nextCoordinates.x + 10;
//     var y = nextCoordinates.y + 20;
//     question.choices.forEach((itemValue: ItemValue, index: number) => {
//       let checkBox = new this.doc.AcroFormCheckBox();
//       checkBox.fieldName = question.id + index;
//       checkBox.Rect = [x, y, 10, 10];
//       checkBox.AS = "/Off";
//       this.doc.text(itemValue.text, x + 20, y + 10);

//       if (question.value.includes(itemValue.value)) {
//         checkBox.AS = "/On";
//       }
//       this.doc.addField(checkBox);
//       y += 20;
//     });
//     return { x: nextCoordinates.x, y: y + 20 };
//   }
// }
// QuestionRepository.instance.register("checkbox", CheckBoxQuestion);
