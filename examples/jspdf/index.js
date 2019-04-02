var doc = new jsPDF();
doc.text('Hello SurveyJS PDF!', 10, 10);
doc.save('survey_result.pdf');
