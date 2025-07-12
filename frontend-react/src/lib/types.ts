export type PersonRole = 'Faculty' | 'Staff' | 'Student';
export type Department = 'Computer Science' | 'Engineering' | 'Business' | 'Arts' | 'Science' | 'Medicine';

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  department: Department;
  title?: string;
  email: string;
  phone?: string;
  expertise?: string[];
  image: string;
  officeHours?: string;
  officeLocation?: string;
  bio?: string;
  education?: string[];
  publications?: string[];
  isChairman?: boolean; // custom flag for faculty
}
