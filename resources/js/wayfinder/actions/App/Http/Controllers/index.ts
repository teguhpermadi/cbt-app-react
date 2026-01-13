import DashboardController from './DashboardController'
import Student from './Student'
import Admin from './Admin'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
Student: Object.assign(Student, Student),
Admin: Object.assign(Admin, Admin),
Settings: Object.assign(Settings, Settings),
}

export default Controllers