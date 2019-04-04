// import {
//   Rect,
//   QuestionRepository,
//   ICoordinates
// } from "./survey";
// import { PdfQuestionRenderer } from "./PdfQuestionRenderer";
// import { IQuestion } from "../base";
// import { QuestionRadiogroupModel } from "../question_radiogroup";
// import { ItemValue } from "../itemvalue";
// import { surveyCss } from "../defaultCss/cssstandard";

// export class RadioGroupQuestion extends PdfQuestionRenderer {
//   constructor(question: IQuestion, doc: any) {
//     super(question, doc);
//   }
//   getBoundaries(coordinates: ICoordinates): Rect {
//     //TODO
//     return null;
//   }
//   render(coordinates: ICoordinates) {
//     var nextCoordinates = super.render(coordinates);
//     var question: QuestionRadiogroupModel = this.getQuestion<
//       QuestionRadiogroupModel
//     >();
//     var x = nextCoordinates.x + 10;
//     var y = nextCoordinates.y + 20;
//     var radioGroup = new this.doc.AcroFormRadioButton();
//     radioGroup.value = question.id;
//     this.doc.addField(radioGroup);
//     question.choices.forEach((itemValue: ItemValue, index: number) => {
//       let name = question.id + index;
//       let radioButton = radioGroup.createOption(name);
//       radioButton.Rect = [x, y, 10, 10];
//       this.doc.text(itemValue.text, x + 20, y + 10);
//       if (question.value == itemValue.value) {
//         radioButton.AS = "/" + name;
//       }
//       y += 20;
//     });

//     radioGroup.setAppearance(this.doc.AcroForm.Appearance.RadioButton.Cross);
//     return { x: nextCoordinates.x, y: y + 20 };
//   }
// }
// QuestionRepository.instance.register("radiogroup", RadioGroupQuestion);
