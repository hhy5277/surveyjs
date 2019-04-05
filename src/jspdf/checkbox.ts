import { IPoint, IRect, QuestionRepository, DocOptions, PdfQuestionRendererBase } from "./survey";
import { IQuestion } from "../base";
import { SelectBaseQuestion } from "./selectbase"
import { ItemValue } from "../itemvalue";
import { QuestionSelectBase } from '../question_baseselect';

export class CheckBoxQuestion extends SelectBaseQuestion {
    constructor(protected question: IQuestion, protected docOptions: DocOptions) {
        super(question, docOptions);
    }
    renderContent(point: IPoint) {
        let question: QuestionSelectBase = this.getQuestion<QuestionSelectBase>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop }
        question.choices.forEach((itemValue: ItemValue, index: number) => {
            let name = question.id + index;
            let item = this.renderItem(currPoint, () => {
                let checkBox = new (<any>this.docOptions.getDoc().AcroFormCheckBox)();
                checkBox.fieldName = name;
                return checkBox;
            }, itemValue);
            if (question.value.includes(itemValue.value)) item.AS = "/On";
            else item.AS = "/Off";
            this.docOptions.getDoc().addField(item);
            let checkButtonBoundaries: IRect = this.getBoudndariesItem(currPoint, itemValue);
            currPoint.yTop = checkButtonBoundaries.yBot;
        });
    }
}
QuestionRepository.getInstance().register("checkbox", CheckBoxQuestion);
