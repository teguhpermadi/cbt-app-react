import DashboardController from './DashboardController'
import ExamController from './ExamController'
import ExamResultController from './ExamResultController'
const Student = {
    DashboardController: Object.assign(DashboardController, DashboardController),
ExamController: Object.assign(ExamController, ExamController),
ExamResultController: Object.assign(ExamResultController, ExamResultController),
}

export default Student