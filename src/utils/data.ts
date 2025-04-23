import { Department, Topic } from "@/types";

export const departmentList: Department[] = [
    { uuid: '1', name: 'HR' },
    { uuid: '2', name: 'Software Development' }
];

export const topicList: Topic[] = [
    { uuid: '1', name: 'Recruitment', description: 'Recruitment process', department: departmentList[0] },
    { uuid: '2', name: 'Onboarding', description: 'Onboarding process', department: departmentList[0] },
    { uuid: '3', name: 'Performance Review', description: 'Performance review process', department: departmentList[0] },
    { uuid: '4', name: 'Employee Relations', description: 'Employee relations process', department: departmentList[0] },
    { uuid: '5', name: 'SDLC', description: 'Software development life cycle process', department: departmentList[1] },
    { uuid: '6', name: 'Agile Methodology', description: 'Agile methodology process', department: departmentList[1] },
    { uuid: '7', name: 'Code Review Process', description: 'Code review process', department: departmentList[1] },
    { uuid: '8', name: 'CI/CD', description: 'Continuous integration and deployment process', department: departmentList[1] },
    { uuid: '9', name: 'Testing', description: 'Testing process', department: departmentList[1] },
    { uuid: '10', name: 'Deployment', description: 'Deployment process', department: departmentList[1] },
    { uuid: '11', name: 'JavaScript', description: 'JavaScript programming language', department: departmentList[1] },
    { uuid: '12', name: 'Python', description: 'Python programming language', department: departmentList[1] },
    { uuid: '13', name: 'Java', description: 'Java programming language', department: departmentList[1] },
    { uuid: '14', name: 'C#', description: 'C# programming language', department: departmentList[1] },
    { uuid: '15', name: 'C++', description: 'C++ programming language', department: departmentList[1] },
]