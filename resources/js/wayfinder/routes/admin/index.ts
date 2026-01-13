import students from './students'
import users from './users'
import subjects from './subjects'
import academicYears from './academic-years'
import grades from './grades'
import exams from './exams'
import questionBanks from './question-banks'
import questions from './questions'
const admin = {
    students: Object.assign(students, students),
users: Object.assign(users, users),
subjects: Object.assign(subjects, subjects),
academicYears: Object.assign(academicYears, academicYears),
grades: Object.assign(grades, grades),
exams: Object.assign(exams, exams),
questionBanks: Object.assign(questionBanks, questionBanks),
questions: Object.assign(questions, questions),
}

export default admin