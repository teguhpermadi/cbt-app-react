import StudentController from './StudentController'
import UserController from './UserController'
import SubjectController from './SubjectController'
import AcademicYearController from './AcademicYearController'
import GradeController from './GradeController'
import GradeStudentController from './GradeStudentController'
import ExamController from './ExamController'
import QuestionBankController from './QuestionBankController'
import QuestionController from './QuestionController'
const Admin = {
    StudentController: Object.assign(StudentController, StudentController),
UserController: Object.assign(UserController, UserController),
SubjectController: Object.assign(SubjectController, SubjectController),
AcademicYearController: Object.assign(AcademicYearController, AcademicYearController),
GradeController: Object.assign(GradeController, GradeController),
GradeStudentController: Object.assign(GradeStudentController, GradeStudentController),
ExamController: Object.assign(ExamController, ExamController),
QuestionBankController: Object.assign(QuestionBankController, QuestionBankController),
QuestionController: Object.assign(QuestionController, QuestionController),
}

export default Admin