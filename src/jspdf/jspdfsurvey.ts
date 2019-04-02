import { SurveyModel } from "../survey";
import jsPDF from "jspdf";

export class JsPdfSurveyModel extends SurveyModel {
  constructor(jsonObject: any) {
    super(jsonObject)
  }

  public render() {
    var doc = new jsPDF();
    var i = 0;
    this.pages.forEach((page: any, index: any) => {
      doc.text(new Number(i).toString(), i * 10, i * 10);
      i++;
    });
    doc.save('survey_result.pdf');
  }
}
