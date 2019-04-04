import { SurveyModel } from "../survey";
import { Question } from "../question";
import { IQuestion } from "../base";
import jsPDF from "jspdf";

export interface IPdfQuestion {
  getBoundaries(coordinates: ICoordinates): Rect;
  render(coordinates: ICoordinates): ICoordinates;
}
export interface ICoordinates {
  x: number;
  y: number;
}
export interface Rect {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBot: number;
}
declare type RendererConstructor = new (
  question: IQuestion,
  doc: any
) => IPdfQuestion;

export class PdfQuestionRenderer implements IPdfQuestion {
  constructor(protected question: IQuestion, protected doc: any) {}
  getBoundaries(coordinates: ICoordinates): Rect {
    //TODO
    return null;
  }
  render(coordinates: ICoordinates): ICoordinates {
    this.doc.text((<any>this.question).title, coordinates.x, coordinates.y);
    return { x: coordinates.x, y: coordinates.y + 20 };
  }
  getQuestion<T extends Question>(): T {
    return <T>this.question;
  }
}

export class QuestionRepository {
  static instance = new QuestionRepository();
  private questions: { [index: string]: RendererConstructor } = {};
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
    super(jsonObject);
  }
  public render() {
    var doc = new jsPDF();
    this.pages.forEach((page: any, index: any) => {
      page.questions.forEach((question: IQuestion) => {
        var renderer = QuestionRepository.instance.create(question, doc);
        renderer.render({ x: 0, y: 20 });
      });
    });
    // TODO: remove? place to proper
    doc.save("survey_result.pdf");
  }
}
