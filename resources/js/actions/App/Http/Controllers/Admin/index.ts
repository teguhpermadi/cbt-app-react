import UserController from './UserController'
import SubjectController from './SubjectController'
import AcademicYearController from './AcademicYearController'
import StudentController from './StudentController'
import GradeController from './GradeController'
import GradeStudentController from './GradeStudentController'
import ExamController from './ExamController'
import LiveScoreController from './LiveScoreController'
import ExamAnalysisController from './ExamAnalysisController'
import ExamManualCorrectionController from './ExamManualCorrectionController'
import QuestionBankController from './QuestionBankController'
import QuestionController from './QuestionController'
const Admin = {
    UserController: Object.assign(UserController, UserController),
SubjectController: Object.assign(SubjectController, SubjectController),
AcademicYearController: Object.assign(AcademicYearController, AcademicYearController),
StudentController: Object.assign(StudentController, StudentController),
GradeController: Object.assign(GradeController, GradeController),
GradeStudentController: Object.assign(GradeStudentController, GradeStudentController),
ExamController: Object.assign(ExamController, ExamController),
LiveScoreController: Object.assign(LiveScoreController, LiveScoreController),
ExamAnalysisController: Object.assign(ExamAnalysisController, ExamAnalysisController),
ExamManualCorrectionController: Object.assign(ExamManualCorrectionController, ExamManualCorrectionController),
QuestionBankController: Object.assign(QuestionBankController, QuestionBankController),
QuestionController: Object.assign(QuestionController, QuestionController),
}

export default Admin