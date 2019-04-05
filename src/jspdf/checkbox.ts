import { IPoint, IRect, QuestionRepository, DocOptions, PdfQuestionRendererBase } from "./survey";
import { IQuestion } from "../base";
import { QuestionCheckboxModel } from "../question_checkbox";
import { ItemValue } from "../itemvalue";

export class CheckBoxQuestion extends PdfQuestionRendererBase {
    constructor(protected question: IQuestion, protected docOptions: DocOptions) {
        super(question, docOptions);
    }
    private getBoudndariesCheckButton(point: IPoint, itemValue: ItemValue): IRect {
        let buttonBoudndaries: IRect = {
            xLeft: point.xLeft,
            xRight: point.xLeft + this.docOptions.getFontSize() *
                this.docOptions.getYScale(),
            yTop: point.yTop,
            yBot: point.yTop + this.docOptions.getFontSize() *
                this.docOptions.getYScale()
        };
        let textPoint: IPoint = {
            xLeft: buttonBoudndaries.xRight,
            yTop: buttonBoudndaries.yTop
        }
        let textBoudndaries: IRect = this.getBoundariesText(textPoint, itemValue.text);
        return {
            xLeft: buttonBoudndaries.xLeft,
            xRight: textBoudndaries.xRight,
            yTop: buttonBoudndaries.yTop,
            yBot: buttonBoudndaries.yBot
        }
    }
    getBoundariesContent(point: IPoint): IRect {
        let bottom: number = point.yTop;
        let right: number = point.xLeft;
        let question: QuestionCheckboxModel = this.getQuestion<QuestionCheckboxModel>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop }
        question.choices.forEach((itemValue: ItemValue) => {
            let checkButtonBoundaries = this.getBoudndariesCheckButton(currPoint, itemValue);
            bottom = checkButtonBoundaries.yBot;
            currPoint.yTop = bottom;
            right = Math.max(right, checkButtonBoundaries.xRight);
        });
        return {
            xLeft: point.xLeft,
            xRight: right,
            yTop: point.yTop,
            yBot: bottom
        };
    }
    private renderCheckButton(point: IPoint, question: QuestionCheckboxModel,
        itemValue: ItemValue, index: number) {
        let checkBox = new (<any>this.docOptions.getDoc().AcroFormCheckBox)();
        checkBox.fieldName = question.id + index;
        checkBox.Rect = [point.xLeft, point.yTop,
            this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale(),
            this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale()];
        let textPoint: IPoint = {
            xLeft: point.xLeft + this.docOptions.getDoc().getFontSize() * this.docOptions.getYScale(),
            yTop: point.yTop
        }
        this.renderText(textPoint, itemValue.text);
        if (question.value.includes(itemValue.value)) checkBox.AS = "/On";
        else checkBox.AS = "/Off";
        this.docOptions.getDoc().addField(checkBox);
    }
    renderContent(point: IPoint) {
        let question: QuestionCheckboxModel = this.getQuestion<QuestionCheckboxModel>();
        let currPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop }
        question.choices.forEach((itemValue: ItemValue, index: number) => {
            this.renderCheckButton(currPoint, question, itemValue, index);
            let checkButtonBoundaries = this.getBoudndariesCheckButton(currPoint, itemValue);
            currPoint.yTop = checkButtonBoundaries.yBot;
        });
    }
}
QuestionRepository.getInstance().register("checkbox", CheckBoxQuestion);
