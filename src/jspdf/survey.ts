import { SurveyModel } from "../survey";
import { Question } from "../question";
import { IQuestion } from "../base";
import jsPDF from "jspdf";

export interface IPoint {
  xLeft: number;
  yTop: number;
}
export interface IRect {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBot: number;
}

export interface IPdfQuestion {
  getBoundariesContent(coordinates: IPoint): IRect;
  getBoundaries(coordinates: IPoint): IRect;
  renderContent(coordinates: IPoint): void;
  render(coordinates: IPoint): void;
}
declare type RendererConstructor = new (
  question: IQuestion,
  docOptions: DocOptions
) => IPdfQuestion;

export class DocOptions {
  constructor(protected doc: any, protected fontSize: number,
    protected xScale: number, protected yScale: number) {
      doc.setFontSize(fontSize);
    }
    getDoc(): any {
      return this.doc;
    }
    getFontSize(): number {
      return this.fontSize;
    }
    getXScale(): number {
      return this.xScale;
    }
    getYScale(): number {
      return this.yScale;
    }
    setXScale(xScale: number) {
      this.xScale = xScale;
    }
    setYScale(yScale: number) {
      this.yScale = yScale;
    }
    setFontSize(fontSize: number) {
      this.fontSize = fontSize;
      this.doc.setFontSize(fontSize);
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
  create(question: IQuestion, docOptions: DocOptions): IPdfQuestion {
    let rendererConstructor =
      this.questions[question.getType()] || PdfQuestionRendererBase;
    return new rendererConstructor(question, docOptions);
  }
}

export class PdfQuestionRendererBase implements IPdfQuestion {
  constructor(protected question: IQuestion, protected docOptions: DocOptions) {}
  getBoundariesTitle(point: IPoint): IRect {
    return {
      xLeft: point.xLeft,
      xRight: point.xLeft +
        this.getQuestion<Question>().title.length *
        this.docOptions.getFontSize() * this.docOptions.getXScale(),
      yTop: point.yTop,
      yBot: point.yTop + this.docOptions.getFontSize() *
        this.docOptions.getYScale()
    };
  }
  getBoundariesContent(point: IPoint): IRect {
    return {
      xLeft: point.xLeft,
      xRight: point.xLeft,
      yTop: point.yTop,
      yBot: point.yTop
    };
  }
  getBoundaries(point: IPoint): IRect {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentCoordinates: IPoint = {
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
        let contentRect: IRect = this.getBoundariesContent(point);
        let titlePoint: IPoint = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        let titleRect: IRect = this.getBoundariesTitle(titlePoint);
        return {
          xLeft: contentRect.xLeft,
          xRight: Math.max(titleRect.xRight, contentRect.xRight),
          yTop: contentRect.yTop,
          yBot: titleRect.yBot
        };
      }
      case "left": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        let contentPoint: IPoint = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        let contentRect: IRect = this.getBoundariesContent(contentPoint);
        return {
          xLeft: titleRect.xLeft,
          xRight: contentRect.xRight,
          yTop: titleRect.yTop,
          yBot: Math.max(titleRect.yBot, contentRect.yBot)
        };
      }
      case "hidden": {
        return this.getBoundariesContent(point);
      }
    }
  }
  private renderTitle(point: IPoint) {
    this.docOptions.getDoc().text(
      (<any>this.question).title,
      point.xLeft,
      point.yTop,
      {
        align: "center",
        baseline: "middle"
      }
    );
  }
  renderContent(point: IPoint) {}
  render(point: IPoint) {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        this.renderTitle(this.centerPoint(point, titleRect));
        let contentPoint: IPoint = {
          xLeft: titleRect.xLeft,
          yTop: titleRect.yBot
        };
        this.renderContent(contentPoint);
        break;
      }
      case "bottom": {
        this.renderContent(point);
        let contentRect: IRect = this.getBoundariesContent(point);
        let titlePoint: IPoint = {
          xLeft: contentRect.xLeft,
          yTop: contentRect.yBot
        };
        let titleRect: IRect = this.getBoundariesTitle(titlePoint);
        this.renderTitle(this.centerPoint(titlePoint, titleRect));
        break;
      }
      case "left": {
        let titleRect: IRect = this.getBoundariesTitle(point);
        this.renderTitle(this.centerPoint(point, titleRect));
        let contentPoint: IPoint = {
          xLeft: titleRect.xRight,
          yTop: titleRect.yTop
        };
        this.renderContent(contentPoint);
        break;
      }
      case "hidden": {
        this.renderContent(point);
        break;
      }
    }
  }
  centerPoint(point: IPoint, boundaries: IRect): IPoint
  {
    return {
      xLeft: point.xLeft + (boundaries.xRight - boundaries.xLeft) / 2.0,
      yTop: point.yTop + (boundaries.yBot - boundaries.yTop) / 2.0
    }
  }
  getQuestion<T extends Question>(): T {
    return <T>this.question;
  }
}

export class JsPdfSurveyModel extends SurveyModel {
  constructor(jsonObject: any) {
    super(jsonObject);
  }
  //isNewPager
  render() {
    let docOptions = new DocOptions(new jsPDF(),
      16, 0.165, 0.36);
    this.pages.forEach((page: any, index: any) => {
      page.questions.forEach((question: IQuestion) => {
        var renderer = QuestionRepository.getInstance().create(question, docOptions);
        renderer.render({ xLeft: 0, yTop: 0 });
      });
    });
    // TODO: remove? place to proper
    docOptions.getDoc().save("survey_result.pdf");
  }
}
