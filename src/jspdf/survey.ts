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
  getBoundariesContent(point: IPoint): IRect;
  getBoundaries(point: IPoint): IRect;
  renderContent(point: IPoint): void;
  render(point: IPoint): void;
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
  private getBoundariesTitle(point: IPoint): IRect {
    return this.getBoundariesText(point, this.getQuestion<Question>().title);
  }
  getBoundariesText(point: IPoint, text: string): IRect {
    return {
      xLeft: point.xLeft,
      xRight: point.xLeft +
        text.length * this.docOptions.getFontSize() *
        this.docOptions.getXScale(),
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
    this.renderText(point, (<any>this.question).title);
  }
  renderText(point: IPoint, text: string) {
    let alignPoint = this.alignPoint(point, this.getBoundariesText(point, text));
    this.docOptions.getDoc().text(
      text,
      alignPoint.xLeft,
      alignPoint.yTop,
      {
        align: "left",
        baseline: "middle"
      }
    );
  }
  renderContent(point: IPoint) {}
  render(point: IPoint) {
    switch (this.getQuestion<Question>().titleLocation) {
      case "top":
      case "default": {
        this.renderTitle(point);
        let titleRect: IRect = this.getBoundariesTitle(point);
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
        this.renderTitle(titlePoint);
        break;
      }
      case "left": {
        this.renderTitle(point);
        let titleRect: IRect = this.getBoundariesTitle(point);
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
  alignPoint(point: IPoint, boundaries: IRect): IPoint
  {
    return {
      xLeft: point.xLeft,
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
  render(fontSize: number, xScale: number, yScale: number) {
    let docOptions = new DocOptions(new jsPDF(),
      fontSize, xScale, yScale);
    let point: IPoint = { xLeft: 0, yTop: 0};
    this.pages.forEach((page: any, index: any) => {
      page.questions.forEach((question: IQuestion) => {
        var renderer = QuestionRepository.getInstance().create(question, docOptions);
        renderer.render(point);
        let renderBoundaries = renderer.getBoundaries(point);
        point.yTop = renderBoundaries.yBot;
      });
    });
    docOptions.getDoc().save("survey_result.pdf");
  }
}
