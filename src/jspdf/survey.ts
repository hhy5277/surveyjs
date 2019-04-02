import { SurveyModel } from "../survey";
import { IQuestion } from '../base';
import jsPDF from "jspdf";

export interface IPdfQuestion {
  render(): void;
}

declare type RendererConstructor = new(question: IQuestion, doc: any) => IPdfQuestion

export class PdfQuestionRenderer implements IPdfQuestion {
  constructor(protected question: IQuestion, protected doc: any) {

  }
  render() {
      this.doc.text((<any>this.question).title, 10, 10);
  }
}

export class QuestionRepository {
  static instance = new QuestionRepository();
  private questions: {[index: string]: RendererConstructor } = {};
  register(type: string, constructor: RendererConstructor) {
    this.questions[type] = constructor;
  }
  create(question: IQuestion, doc: any): IPdfQuestion {
    var creator = this.questions[question.getType()] || PdfQuestionRenderer;
    return new creator(question, doc);
  }
}

export class JsPdfSurveyModel extends SurveyModel {
  constructor(jsonObject: any) {
    super(jsonObject)
  }
  public render() {
    var doc = new jsPDF();
    this.pages.forEach((page: any, index: any) => {
      page.questions.forEach((question: IQuestion) => {
        var renderer = QuestionRepository.instance.create(question, doc);
        renderer.render();
      });
    });
    // TODO: remove? place to proper
    doc.save('survey_result.pdf');
  }
}
