import Student from './Student'
import DashboardController from './DashboardController'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    Student: Object.assign(Student, Student),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers