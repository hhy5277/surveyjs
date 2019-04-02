import { QuestionRepository, PdfQuestionRenderer } from "./survey";
import { IQuestion } from '../base';

export class TextQuestion extends PdfQuestionRenderer {
    constructor(question: IQuestion, doc: any) {
        super(question, doc);
    }
    render() {
        super.render();
    }
}

QuestionRepository.instance.register("text", TextQuestion);
