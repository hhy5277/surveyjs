import { SurveyModel } from "../survey";
import { Question } from "../question";
import { IQuestion } from "../base";
import jsPDF from "jspdf";

export interface IPdfQuestion {
  getBoundariesContent(coordinates: ICoordinates): IRect;
  getBoundaries(coordinates: ICoordinates): IRect;
  renderContent(coordinates: ICoordinates): void;
  render(coordinates: ICoordinates): void;
}
export interface ICoordinates {
  xLeft: number;
  yTop: number;
}
export interface IRect {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBot: number;
}
declare type RendererConstructor = new (
  question: IQuestion,
  doc: any
) => IPdfQuestion;

export class PdfQuestionRendererBase implements IPdfQuestion {
  constructor(protected question: IQuestion, protected doc: any) {}
  getBoundariesTitle(coordinates: ICoordinates): IRect {
    return {
      xLeft: coordinates.xLeft,
      xRight: coordinates.xLeft + this.getQuestion<Question>().title.length,
      yTop: coordinates.yTop,
      yBot: coordinates.yTop + 12
    };
  }
  getBoundariesContent(coordinates: ICoordinates): IRect {
    return null;
  }
  getBoundaries(coordinates: ICoordinates): IRect {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        let titleRect: IRect = this.getBoundariesTitle(coordinates);
        let contentCoordinates: ICoordinates = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        let contentRect: IRect = this.getBoundariesContent(contentCoordinates);
        return {
          xLeft: titleRect.xLeft,
          xRight: Math.max(titleRect.xRight, contentRect.xRight),
          yTop: titleRect.yTop,
          yBot: contentRect.yBot
        };
      }
      case "bottom": {
        let contentRect: IRect = this.getBoundariesContent(coordinates);
        let titleCoordinates: ICoordinates = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        let titleRect: IRect = this.getBoundariesTitle(titleCoordinates);
        return {
          xLeft: contentRect.xLeft,
          xRight: Math.max(titleRect.xRight, contentRect.xRight),
          yTop: contentRect.yTop,
          yBot: titleRect.yBot
        };
      }
      case "left": {
        let titleRect: IRect = this.getBoundariesTitle(coordinates);
        let contentCoordinates: ICoordinates = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        let contentRect: IRect = this.getBoundariesContent(contentCoordinates);
        return {
          xLeft: titleRect.xLeft,
          xRight: contentRect.xRight,
          yTop: titleRect.yTop,
          yBot: Math.max(titleRect.yBot, contentRect.yBot)
        };
      }
      case "hidden": {
        return this.getBoundariesContent(coordinates);
      }
    }
  }
  private renderTitle(coordinates: ICoordinates) {
    this.doc.text(
      (<any>this.question).title,
      coordinates.xLeft,
      coordinates.yTop
    );
  }
  renderContent(coordinates: ICoordinates) {}
  render(coordinates: ICoordinates) {
    debugger;
    console.log("RenderBase");
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        this.renderTitle(coordinates);
        let titleRect: IRect = this.getBoundariesTitle(coordinates);
        let contentCoordinates: ICoordinates = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        this.renderContent(contentCoordinates);
        break;
      }
      case "bottom": {
        this.renderContent(coordinates);
        let contentRect: IRect = this.getBoundariesContent(coordinates);
        let titleCoordinates: ICoordinates = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        this.renderTitle(titleCoordinates);
        break;
      }
      case "left": {
        this.renderTitle(coordinates);
        let titleRect: IRect = this.getBoundariesTitle(coordinates);
        let contentCoordinates: ICoordinates = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        this.renderContent(contentCoordinates);
        break;
      }
      case "hidden": {
        this.renderContent(coordinates);
        break;
      }
    }
  }
  getQuestion<T extends Question>(): T {
    return <T>this.question;
  }
}

export class QuestionRepository {
  private questions: { [index: string]: RendererConstructor } = {};
  private static instance = new QuestionRepository();
  static getInstance(): QuestionRepository {
    return QuestionRepository.instance;
  }
  register(modelType: string, rendererConstructor: RendererConstructor) {
    this.questions[modelType] = rendererConstructor;
  }
  create(question: IQuestion, doc: any): IPdfQuestion {
    let rendererConstructor =
      this.questions[question.getType()] || PdfQuestionRendererBase;
    return new rendererConstructor(question, doc);
  }
}

export class JsPdfSurveyModel extends SurveyModel {
  constructor(jsonObject: any) {
    super(jsonObject);
  }
  //isNewPager
  render() {
    var doc = new jsPDF();
    this.pages.forEach((page: any, index: any) => {
      page.questions.forEach((question: IQuestion) => {
        var renderer = QuestionRepository.getInstance().create(question, doc);
        renderer.render({ xLeft: 0, yTop: 0 });
      });
    });
    // TODO: remove? place to proper
    doc.save("survey_result.pdf");
  }
}
